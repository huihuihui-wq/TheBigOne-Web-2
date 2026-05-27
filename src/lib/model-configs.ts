// ============================================================
// 模型工作流配置映射表（从插件端同步）
// 后端/网页端可直接复制使用
// 最后更新：2026-05-27
// ============================================================

export interface ModelConfig {
  webAppId: number
  mode: 'text_to_image' | 'edit_image' | 'upscale' | 'remove_background' | 'inpainting' | 'live'
  nodes: {
    prompt?: string
    seed?: string
    aspectRatio?: string
    batchSize?: string
    image?: string
    images?: string[]
    denoise?: string
    mask?: string
    longestSide?: string
    width?: string
    height?: string
    inputCount?: string
    maskPrompt?: string
    [key: string]: string | string[] | undefined
  }
  suppressPreviewOutput: boolean
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  // ─── Text2Image ───
  anima_base: {
    webAppId: 54752,
    mode: 'text_to_image',
    nodes: {
      prompt: '36:CR Text.text',
      seed: '30:Seed_.seed',
      batchSize: '39:EmptyLatentImage.batch_size',
      aspectRatio: '40:孤海_kontext生图比例.选择尺寸',
    },
    suppressPreviewOutput: true,
  },
  anima_turbo: {
    webAppId: 54755,
    mode: 'text_to_image',
    nodes: {
      prompt: '20:CR Text.text',
      seed: '78:Seed_.seed',
      batchSize: '80:EmptyLatentImage.batch_size',
      aspectRatio: '82:孤海_kontext生图比例.选择尺寸',
      width: '80:EmptyLatentImage.width',
      height: '80:EmptyLatentImage.height',
    },
    suppressPreviewOutput: true,
  },
  gpt_image_2: {
    webAppId: 54402,
    mode: 'text_to_image',
    nodes: {
      prompt: '19:BizyAirSiliconCloudLLMAPI.user_prompt',
      aspectRatio: '17:BizyAir_GPT_IMAGE_2_T2I_API.aspect_ratio',
    },
    suppressPreviewOutput: false,
  },
  nanobanana: {
    webAppId: 54437,
    mode: 'text_to_image',
    nodes: {
      prompt: '17:BizyAir_NanoBanana2.prompt',
      aspectRatio: '17:BizyAir_NanoBanana2.aspect_ratio',
    },
    suppressPreviewOutput: false,
  },
  z_image_base: {
    webAppId: 54435,
    mode: 'text_to_image',
    nodes: {
      prompt: '31:BizyAirSiliconCloudLLMAPI.user_prompt',
      seed: '20:KSampler.seed',
      batchSize: '30:EmptyLatentImage.batch_size',
      width: '30:EmptyLatentImage.width',
      height: '30:EmptyLatentImage.height',
    },
    suppressPreviewOutput: true,
  },

  // ─── Edit Image ───
  gpt_image_2_i2i: {
    webAppId: 54464,
    mode: 'edit_image',
    nodes: {
      images: ['19:LoadImage.image', '21:LoadImage.image', '22:LoadImage.image', '23:LoadImage.image', '24:LoadImage.image'],
      prompt: '20:BizyAir_GPT_IMAGE_2_I2I_API.prompt',
      aspectRatio: '20:BizyAir_GPT_IMAGE_2_I2I_API.aspect_ratio',
    },
    suppressPreviewOutput: false,
  },
  nanobanana_edit: {
    webAppId: 54460,
    mode: 'edit_image',
    nodes: {
      images: ['19:LoadImage.image', '21:LoadImage.image', '22:LoadImage.image', '23:LoadImage.image', '24:LoadImage.image'],
      prompt: '17:BizyAir_NanoBanana2.prompt',
      inputCount: '17:BizyAir_NanoBanana2.inputcount',
      aspectRatio: '17:BizyAir_NanoBanana2.aspect_ratio',
    },
    suppressPreviewOutput: true,
  },
  qwen_edit: {
    webAppId: 41951,
    mode: 'edit_image',
    nodes: {
      image: '41:LoadImage.image',
      prompt: '68:TextEncodeQwenImageEditPlus.prompt',
    },
    suppressPreviewOutput: false,
  },
  flux_klein_edit: {
    webAppId: 44354,
    mode: 'edit_image',
    nodes: {
      image: '76:LoadImage.image',
      prompt: '108:CLIPTextEncode.text',
    },
    suppressPreviewOutput: false,
  },
  kein_character_edit: {
    webAppId: 54481,
    mode: 'edit_image',
    nodes: {
      images: ['143:LoadImage.image', '142:LoadImage.image', '136:LoadImage.image'],
      prompt: '133:CLIPTextEncode.text',
      aspectRatio: '144:孤海_kontext生图比例.选择尺寸',
    },
    suppressPreviewOutput: true,
  },

  // ─── Upscale ───
  seed_face_2k: {
    webAppId: 46640,
    mode: 'upscale',
    nodes: {
      image: '21:LoadImage.image',
    },
    suppressPreviewOutput: false,
  },
  klein_4k_upscale: {
    webAppId: 46643,
    mode: 'upscale',
    nodes: {
      image: '21:LoadImage.image',
    },
    suppressPreviewOutput: false,
  },
  nanobanana_face_restore: {
    webAppId: 54472,
    mode: 'upscale',
    nodes: {
      image: '18:LoadImage.image',
      aspectRatio: '17:BizyAir_NanoBanana2.aspect_ratio',
    },
    suppressPreviewOutput: true,
  },
  z_image_klein4k: {
    webAppId: 54485,
    mode: 'upscale',
    nodes: {
      image: '163:LoadImage.image',
    },
    suppressPreviewOutput: true,
  },
  anima_3k_upscale: {
    webAppId: 54499,
    mode: 'upscale',
    nodes: {
      image: '136:LoadImage.image',
    },
    suppressPreviewOutput: true,
  },

  // ─── Remove Background ───
  remove_bg_universal: {
    webAppId: 42387,
    mode: 'remove_background',
    nodes: {
      image: '11:LoadImage.image',
    },
    suppressPreviewOutput: false,
  },
  remove_bg_targeted: {
    webAppId: 44371,
    mode: 'remove_background',
    nodes: {
      image: '38:LoadImage.image',
      maskPrompt: '12:PrimitiveString.value',
    },
    suppressPreviewOutput: false,
  },

  // ─── Inpainting ───
  inpainting: {
    webAppId: 46367,
    mode: 'inpainting',
    nodes: {
      image: '63:LoadImage.image',
      prompt: '61:CLIPTextEncode.text',
      mask: '79:LoadImage.image',
    },
    suppressPreviewOutput: false,
  },
  outpainting: {
    webAppId: 46629,
    mode: 'inpainting',
    nodes: {
      image: '62:LoadImage.image',
      mask: '82:LoadImage.image',
      longestSide: '49:ImpactInt.value',
      prompt: '72:CR Text.text',
    },
    suppressPreviewOutput: false,
  },

  // ─── Live (Anima Turbo I2I) ───
  live_anima_turbo: {
    webAppId: 54800,
    mode: 'live',
    nodes: {
      image: '34:LoadImage.image',
      prompt: '28:CR Text.text',
      denoise: '23:KSampler.denoise',
    },
    suppressPreviewOutput: true,
  },
}
