import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, TrendingUp, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

export function ContentRecommendations() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["/api/ai/recommendations"],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const generateRecommendations = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/ai/generate-recommendations");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/ai/recommendations"], data.recommendations);
      toast({
        title: "Success",
        description: "New content recommendations generated!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please check your AI configuration.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  if (isLoading) {
    return <Loading className="h-32" text="Loading recommendations..." />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle>AI Content Recommendations</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateRecommendations.mutate()}
            disabled={isGenerating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          AI-powered suggestions based on your content history and trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No recommendations available yet
            </p>
            <Button onClick={() => generateRecommendations.mutate()} disabled={isGenerating}>
              <Brain className="h-4 w-4 mr-2" />
              Generate Recommendations
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{recommendation}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Create
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}