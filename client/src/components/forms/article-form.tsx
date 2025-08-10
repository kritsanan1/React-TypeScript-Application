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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Globe, Save, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@shared/schema";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt too long").optional(),
  status: z.enum(["draft", "published", "archived"]),
  language: z.string().min(1, "Language is required"),
  tags: z.array(z.string()).optional(),
  seoKeywords: z.array(z.string()).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  article?: Article;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ArticleForm({ article, onSuccess, onCancel }: ArticleFormProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [seoKeywords, setSeoKeywords] = useState<string[]>(article?.seoKeywords || []);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      content: article?.content || "",
      excerpt: article?.excerpt || "",
      status: article?.status || "draft",
      language: article?.language || "en",
      tags: article?.tags || [],
      seoKeywords: article?.seoKeywords || [],
    },
  });

  const createArticle = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const url = article ? `/api/articles/${article.id}` : "/api/articles";
      const method = article ? "PUT" : "POST";
      const response = await apiRequest(method, url, { ...data, seoKeywords });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: `Article ${article ? "updated" : "created"} successfully`,
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${article ? "update" : "create"} article`,
        variant: "destructive",
      });
    },
  });

  const enhanceContent = useMutation({
    mutationFn: async () => {
      setIsEnhancing(true);
      const title = form.getValues("title");
      const content = form.getValues("content");
      
      if (!title || !content) {
        throw new Error("Title and content are required for enhancement");
      }

      const response = await apiRequest("POST", "/api/ai/enhance-content", {
        title,
        content,
      });
      return response.json();
    },
    onSuccess: (data) => {
      form.setValue("content", data.enhancedContent);
      setAiSuggestions(data.suggestions);
      setSeoKeywords(data.seoKeywords);
      toast({
        title: "Content Enhanced",
        description: "AI has improved your content and provided suggestions",
      });
    },
    onError: () => {
      toast({
        title: "Enhancement Failed",
        description: "AI content enhancement is currently unavailable",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsEnhancing(false);
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    createArticle.mutate({ ...data, seoKeywords });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {article ? "Edit Article" : "Create New Article"}
        </h2>
        <div className="flex space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Enter article title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={form.watch("language")}
                    onValueChange={(value) => form.setValue("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(value) => form.setValue("status", value as "draft" | "published" | "archived")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    {...form.register("excerpt")}
                    placeholder="Brief description of the article"
                    rows={3}
                  />
                </div>

                {aiSuggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                        AI Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion, index) => (
                          <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            • {suggestion}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => enhanceContent.mutate()}
                  disabled={isEnhancing || !form.watch("title") || !form.watch("content")}
                >
                  <Sparkles className={`h-4 w-4 mr-2 ${isEnhancing ? 'animate-spin' : ''}`} />
                  Enhance with AI
                </Button>
              </div>
              <Textarea
                id="content"
                {...form.register("content")}
                placeholder="Write your article content here..."
                rows={12}
                className="min-h-[300px]"
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>SEO Keywords</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {seoKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => setSeoKeywords(seoKeywords.filter((_, i) => i !== index))}
                        className="ml-2 text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add SEO keyword and press Enter"
                  className="mt-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value && !seoKeywords.includes(value)) {
                        setSeoKeywords([...seoKeywords, value]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">SEO Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="text-blue-600 text-lg font-medium line-clamp-1">
                        {form.watch("title") || "Article Title"}
                      </h3>
                      <p className="text-green-600 text-sm">
                        yoursite.com/articles/{form.watch("title")?.toLowerCase().replace(/\s+/g, '-') || 'article-slug'}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {form.watch("excerpt") || "Article excerpt will appear here..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Multi-language
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current language: <Badge variant="outline">{form.watch("language")}</Badge>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Create translations for other languages to reach a wider audience.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Article Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <article className="prose prose-lg max-w-none dark:prose-invert">
                  <h1>{form.watch("title") || "Article Title"}</h1>
                  {form.watch("excerpt") && (
                    <p className="lead text-gray-600 dark:text-gray-400">
                      {form.watch("excerpt")}
                    </p>
                  )}
                  <div className="whitespace-pre-wrap">
                    {form.watch("content") || "Article content will appear here..."}
                  </div>
                </article>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={createArticle.isPending}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {createArticle.isPending ? "Saving..." : "Save Article"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}