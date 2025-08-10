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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Save, Package, DollarSign, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Name too long"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      sku: product?.sku || "",
      category: product?.category || "",
      stock: product?.stock || 0,
      status: product?.status || "active",
      tags: [],
      features: [],
      images: [],
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";
      const response = await apiRequest(method, url, { ...data, tags, features });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: `Product ${product ? "updated" : "created"} successfully`,
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product`,
        variant: "destructive",
      });
    },
  });

  const generateDescription = useMutation({
    mutationFn: async () => {
      setIsGeneratingDescription(true);
      const productName = form.getValues("name");
      
      if (!productName || features.length === 0) {
        throw new Error("Product name and features are required for AI generation");
      }

      const response = await apiRequest("POST", "/api/ai/generate-product-description", {
        productName,
        features,
      });
      return response.json();
    },
    onSuccess: (data) => {
      form.setValue("description", data.description);
      if (data.tags && data.tags.length > 0) {
        setTags([...new Set([...tags, ...data.tags])]);
      }
      toast({
        title: "Description Generated",
        description: "AI has created a compelling product description",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "AI description generation is currently unavailable",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGeneratingDescription(false);
    },
  });

  const onSubmit = (data: ProductFormData) => {
    createProduct.mutate({ ...data, tags, features });
  };

  const generateSKU = () => {
    const name = form.getValues("name").toUpperCase().replace(/\s+/g, "");
    const category = form.getValues("category").toUpperCase().substr(0, 3);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const sku = `${category}${name.substr(0, 3)}${random}`;
    form.setValue("sku", sku);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {product ? "Edit Product" : "Create New Product"}
        </h2>
        <div className="flex space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="inventory">Inventory & Pricing</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter product name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.watch("category")}
                    onValueChange={(value) => form.setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="health">Health & Beauty</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Features</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {feature}
                        <button
                          type="button"
                          onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                          className="ml-2 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add feature and press Enter"
                    className="mt-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !features.includes(value)) {
                          setFeatures([...features, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer">
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                          className="ml-2 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tag and press Enter"
                    className="mt-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !tags.includes(value)) {
                          setTags([...tags, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateDescription.mutate()}
                  disabled={isGeneratingDescription || !form.watch("name") || features.length === 0}
                >
                  <Sparkles className={`h-4 w-4 mr-2 ${isGeneratingDescription ? 'animate-spin' : ''}`} />
                  Generate with AI
                </Button>
              </div>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your product..."
                rows={6}
                className="min-h-[150px]"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...form.register("price", { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.watch("status")}
                      onValueChange={(value) => form.setValue("status", value as "active" | "inactive" | "out_of_stock")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sku">SKU</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateSKU}
                      >
                        Generate
                      </Button>
                    </div>
                    <Input
                      id="sku"
                      {...form.register("sku")}
                      placeholder="Product SKU"
                    />
                    {form.formState.errors.sku && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.sku.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      {...form.register("stock", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {form.formState.errors.stock && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.stock.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Product Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{form.watch("name") || "Product Name"}</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      ${form.watch("price")?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Badge variant="secondary">{form.watch("category") || "Category"}</Badge>
                    <Badge variant={form.watch("status") === "active" ? "default" : "secondary"}>
                      {form.watch("status") || "Status"}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {form.watch("description") || "Product description will appear here..."}
                    </p>
                  </div>

                  {features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>SKU: {form.watch("sku") || "Not set"}</span>
                    <span>Stock: {form.watch("stock") || 0} units</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={createProduct.isPending}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {createProduct.isPending ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}