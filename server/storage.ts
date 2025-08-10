import {
  users,
  articles,
  media,
  products,
  analytics,
  aiRecommendations,
  type User,
  type UpsertUser,
  type Article,
  type InsertArticle,
  type Media,
  type InsertMedia,
  type Product,
  type InsertProduct,
  type Analytics,
  type InsertAnalytics,
  type AiRecommendation,
  type InsertAiRecommendation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Article operations
  getArticles(userId?: string, limit?: number): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;
  searchArticles(query: string, userId?: string): Promise<Article[]>;
  
  // Media operations
  getMediaFiles(userId?: string, limit?: number): Promise<Media[]>;
  getMediaFile(id: number): Promise<Media | undefined>;
  createMediaFile(media: InsertMedia): Promise<Media>;
  updateMediaFile(id: number, media: Partial<InsertMedia>): Promise<Media>;
  deleteMediaFile(id: number): Promise<void>;
  
  // Product operations
  getProducts(userId?: string, limit?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Analytics operations
  createAnalyticsEvent(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalytics(userId?: string, startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  
  // AI recommendations operations
  createRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  getRecommendations(userId: string, type?: string): Promise<AiRecommendation[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Article operations
  async getArticles(userId?: string, limit = 50): Promise<Article[]> {
    const query = db.select().from(articles).orderBy(desc(articles.createdAt)).limit(limit);
    
    if (userId) {
      return await query.where(eq(articles.authorId, userId));
    }
    
    return await query;
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article> {
    const [updatedArticle] = await db
      .update(articles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async searchArticles(query: string, userId?: string): Promise<Article[]> {
    const conditions = [like(articles.title, `%${query}%`)];
    if (userId) {
      conditions.push(eq(articles.authorId, userId));
    }

    return await db
      .select()
      .from(articles)
      .where(and(...conditions))
      .orderBy(desc(articles.createdAt));
  }

  // Media operations
  async getMediaFiles(userId?: string, limit = 50): Promise<Media[]> {
    const query = db.select().from(media).orderBy(desc(media.createdAt)).limit(limit);
    
    if (userId) {
      return await query.where(eq(media.uploadedById, userId));
    }
    
    return await query;
  }

  async getMediaFile(id: number): Promise<Media | undefined> {
    const [mediaFile] = await db.select().from(media).where(eq(media.id, id));
    return mediaFile;
  }

  async createMediaFile(mediaData: InsertMedia): Promise<Media> {
    const [newMedia] = await db.insert(media).values(mediaData).returning();
    return newMedia;
  }

  async updateMediaFile(id: number, mediaData: Partial<InsertMedia>): Promise<Media> {
    const [updatedMedia] = await db
      .update(media)
      .set({ ...mediaData, updatedAt: new Date() })
      .where(eq(media.id, id))
      .returning();
    return updatedMedia;
  }

  async deleteMediaFile(id: number): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }

  // Product operations
  async getProducts(userId?: string, limit = 50): Promise<Product[]> {
    const query = db.select().from(products).orderBy(desc(products.createdAt)).limit(limit);
    
    if (userId) {
      return await query.where(eq(products.createdById, userId));
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Analytics operations
  async createAnalyticsEvent(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db.insert(analytics).values(analyticsData).returning();
    return newAnalytics;
  }

  async getAnalytics(userId?: string, startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    const conditions = [];
    if (userId) conditions.push(eq(analytics.userId, userId));
    if (startDate) conditions.push(sql`${analytics.timestamp} >= ${startDate}`);
    if (endDate) conditions.push(sql`${analytics.timestamp} <= ${endDate}`);

    let query = db.select().from(analytics).orderBy(desc(analytics.timestamp));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  }

  // AI recommendations operations
  async createRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const [newRecommendation] = await db.insert(aiRecommendations).values(recommendation).returning();
    return newRecommendation;
  }

  async getRecommendations(userId: string, type?: string): Promise<AiRecommendation[]> {
    const conditions = [eq(aiRecommendations.userId, userId)];
    if (type) {
      conditions.push(eq(aiRecommendations.type, type));
    }

    return await db
      .select()
      .from(aiRecommendations)
      .where(and(...conditions))
      .orderBy(desc(aiRecommendations.createdAt));
  }
}

export const storage = new DatabaseStorage();
