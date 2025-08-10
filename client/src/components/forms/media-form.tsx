import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, X, Image, Video, FileText, Music } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Media } from "@shared/schema";

const mediaSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  originalName: z.string().min(1, "Original name is required"),
  fileUrl: z.string().min(1, "File URL is required"),
  fileType: z.enum(["image", "video", "document", "audio"]),
  fileSize: z.number().min(1, "File size must be greater than 0"),
  altText: z.string().optional(),
  caption: z.string().optional(),
  metadata: z.any().optional(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

interface MediaFormProps {
  media?: Media;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MediaForm({ media, onSuccess, onCancel }: MediaFormProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      fileName: media?.fileName || "",
      originalName: media?.originalName || "",
      fileUrl: media?.fileUrl || "",
      fileType: media?.fileType || "document",
      fileSize: media?.fileSize || 0,
      altText: media?.altText || "",
      caption: media?.caption || "",
      metadata: media?.metadata || {},
    },
  });

  const createMedia = useMutation({
    mutationFn: async (data: MediaFormData) => {
      const url = media ? `/api/media/${media.id}` : "/api/media";
      const method = media ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Success",
        description: `Media ${media ? "updated" : "uploaded"} successfully`,
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${media ? "update" : "upload"} media`,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Auto-fill form fields based on file
      form.setValue("fileName", file.name);
      form.setValue("originalName", file.name);
      form.setValue("fileSize", file.size);
      form.setValue("fileUrl", `/uploads/${file.name}`); // Simulated path
      
      // Set file type based on MIME type
      if (file.type.startsWith('image/')) {
        form.setValue("fileType", "image");
      } else if (file.type.startsWith('video/')) {
        form.setValue("fileType", "video");
      } else if (file.type.startsWith('audio/')) {
        form.setValue("fileType", "audio");
      } else {
        form.setValue("fileType", "document");
      }
    }
  };

  const onSubmit = (data: MediaFormData) => {
    createMedia.mutate(data);
  };

  const getFileIcon = (fileType: "image" | "video" | "document" | "audio") => {
    switch (fileType) {
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'audio':
        return <Music className="h-8 w-8 text-green-500" />;
      case 'document':
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {media ? "Edit Media File" : "Upload New Media"}
        </h2>
        <div className="flex space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* File Upload */}
        {!media && (
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Click to upload or drag and drop
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileUpload}
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Images, videos, audio, and documents up to 10MB
                  </p>
                </div>
              </div>
              
              {uploadedFile && (
                <div className="mt-4 flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {getFileIcon(form.watch("fileType"))}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null);
                      form.reset();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Media Details */}
        <Card>
          <CardHeader>
            <CardTitle>Media Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  {...form.register("fileName")}
                  placeholder="Enter file name"
                />
                {form.formState.errors.fileName && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.fileName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="fileType">File Type</Label>
                <Select
                  value={form.watch("fileType")}
                  onValueChange={(value) => form.setValue("fileType", value as "image" | "video" | "document" | "audio")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                {...form.register("altText")}
                placeholder="Describe the content for accessibility"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                {...form.register("caption")}
                placeholder="Optional caption for the media file"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="submit"
            disabled={createMedia.isPending}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {createMedia.isPending ? "Saving..." : "Save Media"}
          </Button>
        </div>
      </form>
    </div>
  );
}