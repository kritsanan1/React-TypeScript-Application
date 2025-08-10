import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, Trash2, Download, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { MediaForm } from "@/components/forms/media-form";
import type { Media } from "@shared/schema";

export function MediaTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: media = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (mediaId: number) => {
      await apiRequest("DELETE", `/api/media/${mediaId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Success",
        description: "Media file deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete media file",
        variant: "destructive",
      });
    },
  });

  const filteredMedia = media.filter(item =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.altText && item.altText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "audio":
        return "🎵";
      case "document":
        return "📄";
      default:
        return "📁";
    }
  };

  if (isLoading) {
    return <Loading className="h-64" text="Loading media files..." />;
  }

  if (showUploadForm || editingMedia) {
    return (
      <MediaForm
        media={editingMedia || undefined}
        onSuccess={() => {
          setShowUploadForm(false);
          setEditingMedia(null);
        }}
        onCancel={() => {
          setShowUploadForm(false);
          setEditingMedia(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and manage your media files
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setShowUploadForm(true)}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Media</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search media files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No media files found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {searchQuery ? "No media files match your search criteria." : "Get started by uploading your first media file."}
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="text-2xl">{getFileTypeIcon(item.fileType)}</div>
                  <Badge variant="outline">{item.fileType}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm line-clamp-1">{item.originalName}</h4>
                    <p className="text-xs text-gray-500">{formatFileSize(item.fileSize)}</p>
                  </div>
                  
                  {item.altText && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.altText}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.fileUrl} download={item.originalName}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteMediaMutation.mutate(item.id)}
                        disabled={deleteMediaMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}