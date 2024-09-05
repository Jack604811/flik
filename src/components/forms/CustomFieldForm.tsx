import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MoreHorizontal, CalendarIcon, Plus, ChevronDown } from "lucide-react"
import { format } from "date-fns"

type FieldData = {
  name: string
  type: string
  options: string
  placeholder: string
  helperText: string
  required: boolean
  conditionals: Conditional[]
}

type Conditional = {
  id: string
  name: string
  targetType: 'field' | 'spot'
  target: string
  condition: 'is' | 'is not' | 'contains' | 'does not contain' | 'any'
  value: string
  action: 'show' | 'hide' | 'change options' | 'disable'
  newOptions?: string
}

function Preview({ field }: { field: FieldData }) {
  const [date, setDate] = useState<Date>()

  return (
    <div className="space-y-2">
      <Label htmlFor="preview-field">{field.name || 'Field Name'}</Label>
      {field.type === 'input' && (
        <Input id="preview-field" placeholder={field.placeholder || 'Enter value'} required={field.required} />
      )}
      {field.type === 'number' && (
        <Input id="preview-field" type="number" placeholder={field.placeholder || 'Enter number'} required={field.required} />
      )}
      {field.type === 'date' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : field.placeholder || "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
      {field.type === 'dropdown' && (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ? field.options.split(',') : ['Option 1', 'Option 2', 'Option 3']).map((option, index) => (
              <SelectItem key={index} value={option.trim()}>{option.trim()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {(field.helperText || 'Helper text') && <p className="text-sm text-muted-foreground">{field.helperText || 'Helper text'}</p>}
    </div>
  )
}

function ConditionalForm({ conditional, onChange, onDelete, onClone, fields, spots }: {
  conditional: Conditional
  onChange: (updatedConditional: Conditional) => void
  onDelete: () => void
  onClone: () => void
  fields: string[]
  spots: string[]
}) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const spotConditions = ['is', 'is not', 'any']
  const fieldConditions = ['is', 'is not', 'contains', 'does not contain']

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          ref={inputRef}
          value={conditional.name}
          onChange={(e) => onChange({ ...conditional, name: e.target.value })}
          className={`text-lg font-semibold bg-transparent ${isEditing ? 'border' : 'border-none'}`}
          onBlur={() => setIsEditing(false)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsEditing(true)}>Rename</DropdownMenuItem>
            <DropdownMenuItem onSelect={onClone}>Clone</DropdownMenuItem>
            <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <Label>If</Label>
        <Select 
          value={conditional.targetType} 
          onValueChange={(value: 'field' | 'spot') => onChange({ 
            ...conditional, 
            targetType: value, 
            target: value === 'spot' ? '' : conditional.target,
            condition: value === 'spot' ? 'is' : 'is',
            value: ''
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="field">Field</SelectItem>
            <SelectItem value="spot">Spot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {conditional.targetType === 'field' && (
        <div className="space-y-2">
          <Label>Target</Label>
          <Select value={conditional.target} onValueChange={(value) => onChange({ ...conditional, target: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select 
          value={conditional.condition} 
          onValueChange={(value: typeof conditional.condition) => onChange({ ...conditional, condition: value, value: value === 'any' ? '' : conditional.value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {(conditional.targetType === 'spot' ? spotConditions : fieldConditions).map((condition) => (
              <SelectItem key={condition} value={condition}>{condition}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {conditional.condition !== 'any' && (
        <div className="space-y-2">
          <Label>Value</Label>
          {conditional.targetType === 'spot' ? (
            <Select value={conditional.value} onValueChange={(value) => onChange({ ...conditional, value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {spots.map((spot) => (
                  <SelectItem key={spot} value={spot}>{spot}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={conditional.value} onChange={(e) => onChange({ ...conditional, value: e.target.value })} placeholder="Enter value" />
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Then</Label>
        <Select value={conditional.action} onValueChange={(value: 'show' | 'hide' | 'change options' | 'disable') => onChange({ ...conditional, action: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="show">Show</SelectItem>
            <SelectItem value="hide">Hide</SelectItem>
            <SelectItem value="disable">Disable</SelectItem>
            {conditional.targetType === 'field' && <SelectItem value="change options">Change Options</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {conditional.action === 'change options' && (
        <div className="space-y-2">
          <Label>New Options (comma-separated)</Label>
          <Input value={conditional.newOptions || ''} onChange={(e) => onChange({ ...conditional, newOptions: e.target.value })} placeholder="Option 1, Option 2, Option 3" />
        </div>
      )}
    </div>
  )
}

function CustomAccordion({ items, activeItem, onItemClick, renderContent }: {
  items: { id: string; title: string }[]
  activeItem: string | null
  onItemClick: (id: string) => void
  renderContent: (id: string) => React.ReactNode
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="border rounded-md">
          {activeItem !== item.id && (
            <button
              className="w-full p-4 text-left flex justify-between items-center"
              onClick={() => onItemClick(item.id)}
            >
              <span>{item.title}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
          {activeItem === item.id && (
            <div className="p-4">
              {renderContent(item.id)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onAddConditional }: { onAddConditional: () => void }) {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-semibold mb-2">No conditionals yet</h3>
      <p className="text-muted-foreground mb-4">Add a conditional to customize the behavior of your field.</p>
      <Button onClick={onAddConditional} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Conditional
      </Button>
    </div>
  )
}

export default function Component() {
  const [field, setField] = useState<FieldData>({
    name: '',
    type: 'input',
    options: '',
    placeholder: '',
    helperText: '',
    required: false,
    conditionals: []
  })

  const [activeConditional, setActiveConditional] = useState<string | null>(null)

  // Mock data for existing fields and spots
  const existingFields = ['Field 1', 'Field 2', 'Field 3']
  const existingSpots = ['Spot 1', 'Spot 2', 'Spot 3']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setField(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Form submitted', field)
  }

  const addConditional = () => {
    if (field.conditionals.length < 6) {
      const newConditional: Conditional = {
        id: String(field.conditionals.length + 1),
        name: `Condition ${field.conditionals.length + 1}`,
        targetType: 'field',
        target: '',
        condition: 'is',
        value: '',
        action: 'show'
      }
      setField(prev => ({
        ...prev,
        conditionals: [...prev.conditionals, newConditional]
      }))
      setActiveConditional(newConditional.id)
    }
  }

  const updateConditional = (updatedConditional: Conditional) => {
    setField(prev => ({
      ...prev,
      conditionals: prev.conditionals.map((c) => c.id === updatedConditional.id ? updatedConditional : c)
    }))
  }

  const deleteConditional = (id: string) => {
    setField(prev => ({
      ...prev,
      conditionals: prev.conditionals.filter((c) => c.id !== id)
    }))
    if (activeConditional === id) {
      setActiveConditional(prev => {
        const index = field.conditionals.findIndex(c => c.id === id)
        return index > 0 ? field.conditionals[index - 1].id : null
      })
    }
  }

  const cloneConditional = (id: string) => {
    if (field.conditionals.length < 6) {
      const conditionalToClone = field.conditionals.find(c => c.id === id)
      if (conditionalToClone) {
        const clonedConditional: Conditional = { 
          ...conditionalToClone, 
          id: String(field.conditionals.length + 1),
          name: `${conditionalToClone.name} (Copy)` 
        }
        setField(prev => ({
          ...prev,
          conditionals: [...prev.conditionals, clonedConditional]
        }))
        setActiveConditional(clonedConditional.id)
      }
    }
  }

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="conditionals">Conditionals</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <form onSubmit={handleSubmit}>
        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={field.name} onChange={handleChange} placeholder="Enter field name" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={field.type} onValueChange={(value) => setField(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="input">Input</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {field.type === 'dropdown' && (
            <div className="space-y-2">
              <Label htmlFor="options">Options (comma-separated)</Label>
              <Input id="options" name="options" value={field.options} onChange={handleChange} placeholder="Option 1, Option 2, Option 3" />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input id="placeholder" name="placeholder" value={field.placeholder} onChange={handleChange} placeholder="Enter placeholder text" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="helperText">Helper Text</Label>
            <Textarea id="helperText" name="helperText" value={field.helperText} onChange={handleChange} placeholder="Enter helper text" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="required" checked={field.required}
              onCheckedChange={(checked) => setField(prev => ({ ...prev, required: checked }))} />
            <Label htmlFor="required">Required</Label>
          </div>
        </TabsContent>
        <TabsContent value="conditionals" className="space-y-4">
          {field.conditionals.length === 0 ? (
            <EmptyState onAddConditional={addConditional} />
          ) : (
            <>
              <CustomAccordion
                items={field.conditionals.map(c => ({ id: c.id, title: c.name }))}
                activeItem={activeConditional}
                onItemClick={setActiveConditional}
                renderContent={(id) => {
                  const conditional = field.conditionals.find(c => c.id === id)
                  if (!conditional) return null
                  return (
                    <ConditionalForm
                      conditional={conditional}
                      onChange={updateConditional}
                      onDelete={() => deleteConditional(id)}
                      onClone={() => cloneConditional(id)}
                      fields={existingFields}
                      spots={existingSpots}
                    />
                  )
                }}
              />
              {field.conditionals.length < 6 && (
                <Button onClick={addConditional} type="button" className="w-full" variant="ghost">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Conditional
                </Button>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="preview" className="pt-4">
          <Preview field={field} />
        </TabsContent>
        <div className="mt-6">
          <Button type="submit" className="w-full">Save Custom Field</Button>
        </div>
      </form>
    </Tabs>
  )
}