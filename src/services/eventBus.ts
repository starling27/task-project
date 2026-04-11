import { EventEmitter } from 'events';

export enum SystemEvents {
  STORY_CREATED = 'story.created',
  STORY_UPDATED = 'story.updated',
  STORY_STATUS_CHANGED = 'story.status_changed',
  STORY_ASSIGNED = 'story.assigned',
  COMMENT_ADDED = 'comment.added',
}

export interface EventPayloads {
  [SystemEvents.STORY_CREATED]: { storyId: string; payload: any };
  [SystemEvents.STORY_UPDATED]: { storyId: string; changes: any };
  [SystemEvents.STORY_STATUS_CHANGED]: { storyId: string; oldStatus: string; newStatus: string };
  [SystemEvents.STORY_ASSIGNED]: { storyId: string; oldAssigneeId?: string; newAssigneeId?: string };
  [SystemEvents.COMMENT_ADDED]: { storyId: string; commentId: string; userId: string };
}

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(20);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public emitEvent<T extends SystemEvents>(event: T, data: EventPayloads[T]): void {
    console.log(`[EventBus] Emitting event: ${event}`, data);
    this.emit(event, data);
  }

  public subscribe<T extends SystemEvents>(event: T, handler: (data: EventPayloads[T]) => void): void {
    this.on(event, handler);
  }
}

export const eventBus = EventBus.getInstance();
