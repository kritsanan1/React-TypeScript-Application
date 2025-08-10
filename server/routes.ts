import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertArticleSchema,
  insertMediaSchema,
  insertProductSchema,
  insertAnalyticsSchema,
  insertAiRecommendationSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Article routes
  app.get('/api/articles', async (req, res) => {
    try {
      const { userId, limit } = req.query;
      const articles = await storage.getArticles(
        userId as string, 
        limit ? parseInt(limit as string) : undefined
      );
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get('/api/articles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getArticle(parseInt(id));
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post('/api/articles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const articleData = insertArticleSchema.parse({ ...req.body, authorId: userId });
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(400).json({ message: "Failed to create article" });
    }
  });

  app.put('/api/articles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if user owns the article
      const existingArticle = await storage.getArticle(parseInt(id));
      if (!existingArticle || existingArticle.authorId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const article = await storage.updateArticle(parseInt(id), req.body);
      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(400).json({ message: "Failed to update article" });
    }
  });

  app.delete('/api/articles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if user owns the article
      const existingArticle = await storage.getArticle(parseInt(id));
      if (!existingArticle || existingArticle.authorId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteArticle(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  app.get('/api/articles/search/:query', async (req, res) => {
    try {
      const { query } = req.params;
      const { userId } = req.query;
      const articles = await storage.searchArticles(query, userId as string);
      res.json(articles);
    } catch (error) {
      console.error("Error searching articles:", error);
      res.status(500).json({ message: "Failed to search articles" });
    }
  });

  // Media routes
  app.get('/api/media', async (req, res) => {
    try {
      const { userId, limit } = req.query;
      const media = await storage.getMediaFiles(
        userId as string, 
        limit ? parseInt(limit as string) : undefined
      );
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.get('/api/media/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const media = await storage.getMediaFile(parseInt(id));
      if (!media) {
        return res.status(404).json({ message: "Media not found" });
      }
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.post('/api/media', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const mediaData = insertMediaSchema.parse({ ...req.body, uploadedById: userId });
      const media = await storage.createMediaFile(mediaData);
      res.status(201).json(media);
    } catch (error) {
      console.error("Error creating media:", error);
      res.status(400).json({ message: "Failed to create media" });
    }
  });

  app.put('/api/media/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if user owns the media
      const existingMedia = await storage.getMediaFile(parseInt(id));
      if (!existingMedia || existingMedia.uploadedById !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const media = await storage.updateMediaFile(parseInt(id), req.body);
      res.json(media);
    } catch (error) {
      console.error("Error updating media:", error);
      res.status(400).json({ message: "Failed to update media" });
    }
  });

  app.delete('/api/media/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if user owns the media
      const existingMedia = await storage.getMediaFile(parseInt(id));
      if (!existingMedia || existingMedia.uploadedById !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteMediaFile(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ message: "Failed to delete media" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { userId, limit } = req.query;
      const products = await storage.getProducts(
        userId as string, 
        limit ? parseInt(limit as string) : undefined
      );
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productData = insertProductSchema.parse({ ...req.body, createdById: userId });
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if user owns the product
      const existingProduct = await storage.getProduct(parseInt(id));
      if (!existingProduct || existingProduct.createdById !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const product = await storage.updateProduct(parseInt(id), req.body);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if user owns the product
      const existingProduct = await storage.getProduct(parseInt(id));
      if (!existingProduct || existingProduct.createdById !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteProduct(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Analytics routes
  app.post('/api/analytics', async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalyticsEvent(analyticsData);
      res.status(201).json(analytics);
    } catch (error) {
      console.error("Error creating analytics event:", error);
      res.status(400).json({ message: "Failed to create analytics event" });
    }
  });

  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      const analytics = await storage.getAnalytics(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // AI Recommendations routes
  app.post('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recommendationData = insertAiRecommendationSchema.parse({ 
        ...req.body, 
        userId 
      });
      const recommendation = await storage.createRecommendation(recommendationData);
      res.status(201).json(recommendation);
    } catch (error) {
      console.error("Error creating recommendation:", error);
      res.status(400).json({ message: "Failed to create recommendation" });
    }
  });

  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type } = req.query;
      const recommendations = await storage.getRecommendations(userId, type as string);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
