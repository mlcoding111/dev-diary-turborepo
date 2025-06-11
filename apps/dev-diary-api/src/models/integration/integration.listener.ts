import { Injectable } from '@nestjs/common';
import { Integration } from '@/entities/integration.entity';
import { OnEvent } from '@nestjs/event-emitter';
import type { InsertEvent, UpdateEvent } from 'typeorm';

@Injectable()
export class IntegrationListener {}
