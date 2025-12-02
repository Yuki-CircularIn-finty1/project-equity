import { z } from 'zod';
import { ValidationError } from './errors';

const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  nextSceneId: z.string(),
  condition: z.string().optional(),
});

const CharacterConfigSchema = z.union([
  z.string(), // Simple string ID
  z.object({
    image: z.string(),
    scale: z.number().optional(),
    opacity: z.number().optional(),
    xOffset: z.string().optional(),
    yOffset: z.string().optional(),
    filter: z.string().optional(),
  })
]);

const SceneSchema = z.object({
  id: z.string(),
  text: z.string(),
  backgroundId: z.string(),
  characterId: z.string().optional(),
  characterImgId: z.string().optional(), // Legacy single character support
  characters: z.object({
    left: CharacterConfigSchema.optional(),
    center: CharacterConfigSchema.optional(),
    right: CharacterConfigSchema.optional(),
  }).optional(), // Multi-character support
  characterExpression: z.string().optional(),
  bgm: z.string().optional(),
  se: z.string().optional(),
  seRepeat: z.number().optional(),
  seInterval: z.number().optional(),
  choices: z.array(ChoiceSchema).optional(),
  nextSceneId: z.string().optional(),
  type: z.enum(['normal', 'ending']).optional(),
});

export const ChapterSchema = z.object({
  scenes: z.array(SceneSchema),
});

export type ChapterData = z.infer<typeof ChapterSchema>;

export function validateChapter(data: unknown): ChapterData {
  try {
    return ChapterSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(`Invalid chapter data: ${error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw new ValidationError('Unknown validation error');
  }
}
