'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Info, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductFormValues } from './schema';

interface FeaturesTagsSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

export function FeaturesTagsSection({ form }: FeaturesTagsSectionProps) {
  const [tags, setTags] = useState<string[]>(form.getValues('tags'));
  const [features, setFeatures] = useState<string[]>(form.getValues('features'));

  const handleAddFeature = () => {
    const newFeatures = [...features, ''];
    setFeatures(newFeatures);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    form.setValue('features', newFeatures);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    form.setValue('features', newFeatures);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !tags.includes(value)) {
        const newTags = [...tags, value];
        setTags(newTags);
        form.setValue('tags', newTags);
        e.currentTarget.value = '';
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1 text-sm font-medium">
            Fitur & Manfaat Produk <Info className="w-3 h-3 text-muted-foreground" />
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-green-600 text-xs hover:text-green-700 hover:bg-green-50"
            onClick={handleAddFeature}
          >
            <Plus className="w-3 h-3 mr-1" /> Tambah Fitur
          </Button>
        </div>
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded text-[10px] text-slate-400">
                :::
              </div>
              <Input
                value={feature}
                onChange={(e) => handleFeatureChange(idx, e.target.value)}
                className="h-9 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                onClick={() => handleRemoveFeature(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Tag / Keyword</Label>
        <div className="space-y-3">
          <Input
            placeholder="Tambahkan tag"
            className="h-9 text-sm"
            onKeyDown={handleAddTag}
          />
          <p className="text-[10px] text-muted-foreground italic">
            Tekan Enter untuk menambahkan tag
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-2 py-1 bg-slate-100 text-slate-700 font-normal hover:bg-slate-200 border-none"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
