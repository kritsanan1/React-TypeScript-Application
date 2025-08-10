import { storage } from "./storage";

export interface AnalyticsEvent {
  userId?: string;
  event: string;
  data: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await storage.createAnalytics({
        userId: event.userId,
        event: event.event,
        data: event.data,
        timestamp: event.timestamp,
        sessionId: event.sessionId,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  async trackPageView(userId: string | undefined, path: string, sessionId?: string, userAgent?: string, ipAddress?: string): Promise<void> {
    await this.trackEvent({
      userId,
      event: 'page_view',
      data: { path },
      timestamp: new Date(),
      sessionId,
      userAgent,
      ipAddress,
    });
  }

  async trackArticleView(userId: string | undefined, articleId: number, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      event: 'article_view',
      data: { articleId },
      timestamp: new Date(),
      sessionId,
    });

    // Update article view count
    await storage.incrementArticleViews(articleId);
  }

  async trackProductView(userId: string | undefined, productId: number, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      event: 'product_view',
      data: { productId },
      timestamp: new Date(),
      sessionId,
    });
  }

  async trackMediaView(userId: string | undefined, mediaId: number, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      event: 'media_view',
      data: { mediaId },
      timestamp: new Date(),
      sessionId,
    });
  }

  async trackUserAction(userId: string, action: string, data: Record<string, any> = {}, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      event: action,
      data,
      timestamp: new Date(),
      sessionId,
    });
  }

  async getContentPerformance(userId: string, startDate: Date, endDate: Date): Promise<{
    articleViews: { articleId: number; views: number; title: string }[];
    productViews: { productId: number; views: number; name: string }[];
    mediaViews: { mediaId: number; views: number; fileName: string }[];
    totalEvents: number;
    uniqueSessions: number;
  }> {
    const analytics = await storage.getAnalyticsByUserAndDateRange(userId, startDate, endDate);
    
    const articleViews = new Map<number, number>();
    const productViews = new Map<number, number>();
    const mediaViews = new Map<number, number>();
    const sessions = new Set<string>();

    for (const event of analytics) {
      if (event.sessionId) sessions.add(event.sessionId);
      
      switch (event.event) {
        case 'article_view':
          const articleId = event.data.articleId;
          articleViews.set(articleId, (articleViews.get(articleId) || 0) + 1);
          break;
        case 'product_view':
          const productId = event.data.productId;
          productViews.set(productId, (productViews.get(productId) || 0) + 1);
          break;
        case 'media_view':
          const mediaId = event.data.mediaId;
          mediaViews.set(mediaId, (mediaViews.get(mediaId) || 0) + 1);
          break;
      }
    }

    // Get content details
    const articleDetails = await Promise.all(
      Array.from(articleViews.entries()).map(async ([id, views]) => {
        const article = await storage.getArticle(id);
        return { articleId: id, views, title: article?.title || 'Unknown' };
      })
    );

    const productDetails = await Promise.all(
      Array.from(productViews.entries()).map(async ([id, views]) => {
        const product = await storage.getProduct(id);
        return { productId: id, views, name: product?.name || 'Unknown' };
      })
    );

    const mediaDetails = await Promise.all(
      Array.from(mediaViews.entries()).map(async ([id, views]) => {
        const media = await storage.getMedia(id);
        return { mediaId: id, views, fileName: media?.fileName || 'Unknown' };
      })
    );

    return {
      articleViews: articleDetails,
      productViews: productDetails,
      mediaViews: mediaDetails,
      totalEvents: analytics.length,
      uniqueSessions: sessions.size,
    };
  }
}

export const analyticsService = AnalyticsService.getInstance();