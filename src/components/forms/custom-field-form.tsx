'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Plus } from 'lucide-react';

type FieldType = 'input' | 'number' | 'date' |'time' |  'dropdown' | 'file';

export default function CustomFieldForm() {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('input');
  const [placeholder, setPlaceholder] = useState('');
  const [options, setOptions] = useState('');
  const [open, setOpen] = useState(false); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldName && fieldType) {
      const formData = {
        fieldName,
        fieldType,
        placeholder,
        options: fieldType === 'dropdown' ? options.split(',').map(option => option.trim()) : undefined,
      };
      console.log('Submitted:', formData);
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <>
      <Credenza onOpenChange={setOpen} open={open}>
        <CredenzaTrigger asChild>
          <Button>
            <Plus className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:block">New Field</span>
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Add Custom Field</CredenzaTitle>
            <CredenzaDescription>
              Use this form to add a new custom field to your form.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="Enter field name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldType">Field Type</Label>
                <Select value={fieldType} onValueChange={(value: FieldType) => setFieldType(value)}>
                  <SelectTrigger id="fieldType">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="input">Input</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>
              {fieldType === 'dropdown' && (
                <div className="space-y-2">
                  <Label htmlFor="options">Dropdown Options</Label>
                  <Input
                    id="options"
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    placeholder="Enter options separated by commas"
                  />
                </div>
              )}
              <CredenzaFooter>
                <CredenzaClose asChild>
                  <Button variant="outline">Cancel</Button>
                </CredenzaClose>
                <Button type="submit">Add Field</Button>
              </CredenzaFooter>
            </form>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
