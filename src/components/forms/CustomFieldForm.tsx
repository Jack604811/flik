import { useState, useCallback, useRef, useEffect } from 'react'
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
import { MoreHorizontal, CalendarIcon } from "lucide-react"
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
  const spotConditions = ['is', 'is not', 'any']
  const fieldConditions = ['is', 'is not', 'contains', 'does not contain']

  return (
    <div className="space-y-4 border p-4 rounded-md relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 absolute top-2 right-2">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onClone}>Clone</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
            <SelectValue placeholder="Select target type" />
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
              <SelectValue placeholder="Select target" />
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
            <SelectValue placeholder="Select condition" />
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
                <SelectValue placeholder="Select spot" />
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
            <SelectValue placeholder="Select action" />
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

  const [leftWidth, setLeftWidth] = useState(60)
  const containerRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      setLeftWidth(newLeftWidth)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  useEffect(() => {
    const divider = dividerRef.current
    divider?.addEventListener('mousedown', handleMouseDown as any)

    return () => {
      divider?.removeEventListener('mousedown', handleMouseDown as any)
    }
  }, [handleMouseDown])

  const addConditional = () => {
    setField(prev => ({
      ...prev,
      conditionals: [...prev.conditionals, {
        targetType: 'field',
        target: '',
        condition: 'is',
        value: '',
        action: 'show'
      }]
    }))
  }

  const updateConditional = (index: number, updatedConditional: Conditional) => {
    setField(prev => ({
      ...prev,
      conditionals: prev.conditionals.map((c, i) => i === index ? updatedConditional : c)
    }))
  }

  const deleteConditional = (index: number) => {
    setField(prev => ({
      ...prev,
      conditionals: prev.conditionals.filter((_, i) => i !== index)
    }))
  }

  const cloneConditional = (index: number) => {
    setField(prev => ({
      ...prev,
      conditionals: [
        ...prev.conditionals.slice(0, index + 1),
        { ...prev.conditionals[index] },
        ...prev.conditionals.slice(index + 1)
      ]
    }))
  }

  return (
    <div ref={containerRef} className="flex h-[calc(100vh-2rem)] max-w-7xl mx-auto">
      <div style={{ width: `${leftWidth}%` }} className="overflow-auto">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Create Custom Field</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="conditionals">Conditionals</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={field.name} onChange={handleChange} placeholder="Enter field name" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={field.type} onValueChange={(value) => setField(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
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
                  {field.conditionals.map((conditional, index) => (
                    <ConditionalForm
                      key={index}
                      conditional={conditional}
                      onChange={(updatedConditional) => updateConditional(index, updatedConditional)}
                      onDelete={() => deleteConditional(index)}
                      onClone={() => cloneConditional(index)}
                      fields={existingFields}
                      spots={existingSpots}
                    />
                  ))}
                  <Button onClick={addConditional}>Add Conditional</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full">Save Custom Field</Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div
        ref={dividerRef}
        className="w-1 bg-border cursor-col-resize hover:bg-primary transition-colors"
      />

      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-auto">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Preview field={field} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}