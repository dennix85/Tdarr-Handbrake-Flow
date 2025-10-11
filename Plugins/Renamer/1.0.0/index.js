"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
const fileUtils_1 = require("../../../../FlowHelpers/1.0.0/fileUtils");
const cliUtils_1 = require("../../../../FlowHelpers/1.0.0/cliUtils");
const os = require('os');
const fs = require('fs');
const path = require('path');

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details
const details = () => ({
    name: '📝 DeNiX File Renaming: Modern Codec Detection & Intelligent Naming',
    description: 'Standalone file renaming plugin with modern codec detection (H.264, H.265, AV1, Opus, etc.), resolution detection, HDR info, intelligent codec insertion for missing info, custom tags with positioning, dot cleaning, and additional file renaming. Preserves existing tags or replaces based on preference.',
    style: {
        borderColor: '#8B4513',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        boxShadow: `
            0 0 10px rgba(139, 69, 19, 0.5),
            0 0 25px rgba(139, 69, 19, 0.46),
            0 0 40px rgba(139, 69, 19, 0.42),
            0 0 55px rgba(139, 69, 19, 0.39),
            0 0 70px rgba(139, 69, 19, 0.35),
            0 0 85px rgba(139, 69, 19, 0.31),
            0 0 100px rgba(139, 69, 19, 0.27),
            0 0 115px rgba(139, 69, 19, 0.23),
            0 0 130px rgba(139, 69, 19, 0.19),
            0 0 145px rgba(139, 69, 19, 0.17),
            0 0 160px rgba(139, 69, 19, 0.15),
            inset 0 0 20px rgba(139, 69, 19, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(139, 69, 19, 0.1), rgba(139, 69, 19, 0.15))',
    },
    tags: 'renaming,codec,detection,modern,intelligent,denix',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '📝',
    inputs: [
        {
            label: '🎬 Rename Video Info',
            name: 'rename_video',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Rename files based on video codec information (H.264, H.265/HEVC, AV1, VP9, etc.)',
        },
        {
            label: '🎵 Rename Audio Info',
            name: 'rename_audio',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Rename files based on audio codec information (AAC, AC-3, EAC-3, TrueHD, DTS-HD MA, Atmos, etc.)',
        },
        {
            label: '📐 Rename Resolution Info',
            name: 'rename_resolution',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Rename files based on video resolution (4K, 2160p, 1080p, 720p, 480p, etc.)',
        },
        {
            label: '🌈 Include HDR Info',
            name: 'include_hdr_info',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Include HDR information in filename (HDR10, HDR10+, Dolby Vision). Only works when video renaming is enabled.',
        },
        {
            label: '🔧 Insert Missing Codec Info',
            name: 'insert_missing_codec_info',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Add missing codec information in brackets when not present in filename. Format: [Audio+Channels] [HDR] [Resolution] [Video] [Custom]. Preserves existing order if codecs already present.',
        },
        {
            label: '🎭 Codec Format Style',
            name: 'codec_format',
            type: 'string',
            defaultValue: 'standard',
            inputUI: {
                type: 'dropdown',
                options: ['standard', 'detailed', 'short'],
            },
            tooltip: 'Codec naming format: standard: H.264, H.265, AV1 | detailed: H.264-Main, H.265-Main10, AV1-Main | short: x264, x265, av1',
        },
        {
            label: '📏 Resolution Format Style',
            name: 'resolution_format',
            type: 'string',
            defaultValue: 'standard',
            inputUI: {
                type: 'dropdown',
                options: ['standard', 'marketing', 'technical'],
            },
            tooltip: 'Resolution naming format: standard: 1080p, 720p, 480p | marketing: 4K, 2K, HD, SD | technical: 2160p, 1440p, 1080p, 720p',
        },
        {
            label: '🏷️ Custom Tag',
            name: 'custom_tag',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Add custom tag to filename (e.g., [tdarr], [processed], {transcoded}). Leave empty to disable. Added before file extension.',
        },
        {
            label: '📍 Custom Tag Position',
            name: 'custom_tag_position',
            type: 'string',
            defaultValue: 'end',
            inputUI: {
                type: 'dropdown',
                options: ['end', 'after_title', 'before_codecs'],
            },
            tooltip: 'Position for custom tag: end: At the end before extension | after_title: After the main title/show name | before_codecs: Before codec information',
        },
        {
            label: '🛡️ Preserve Existing Tags',
            name: 'preserve_existing_tags',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Preserve existing codec tags in filename instead of replacing them. Useful for files already properly tagged.',
        },
        {
            label: '🧹 Remove Dots Before Release Tags',
            name: 'remove_dots_before_release_tags',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Remove dots before release tags (.-TAG becomes -TAG) for cleaner filename formatting like professional releases.',
        },
        {
            label: '🔎 Additional Extensions',
            name: 'additional_extensions',
            type: 'string',
            defaultValue: '.nfo,.srt,.ass,.sup,.idx,.sub',
            inputUI: { type: 'text' },
            tooltip: 'Additional file extensions to rename (comma-separated). Common: .nfo,.srt,.ass,.sup,.idx,.sub,.vtt',
        },
        {
            label: '📊 Logging Level',
            name: 'logging_level',
            type: 'string',
            defaultValue: 'info',
            inputUI: {
                type: 'dropdown',
                options: ['info', 'extended', 'debug'],
            },
            tooltip: 'Logging level: info (basic), extended (detailed metrics), debug (full diagnostics)',
        },
        {
            label: '🛠️ FFmpeg Path (Linux/Docker)',
            name: 'ffmpegPath',
            type: 'string',
            defaultValue: 'ffmpeg',
            inputUI: { type: 'text' },
            tooltip: 'Path to FFmpeg binary for Linux/Docker/LXC environments (default: ffmpeg)',
        },
        {
            label: '🪟 FFmpeg Path (Windows)',
            name: 'ffmpegPathWindows',
            type: 'string',
            defaultValue: 'ffmpeg.exe',
            inputUI: { type: 'text' },
            tooltip: 'Path to FFmpeg binary for Windows environments (default: ffmpeg.exe)',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: '✅ Continue to next plugin - Processing completed successfully',
        },
        {
            number: 2,
            tooltip: '⚠️ No changes needed - File already optimal',
        },
        {
            number: 3,
            tooltip: '❌ Error occurred during processing',
        },
    ],
});
exports.details = details;

// ===============================================
// LOGGING UTILITY WITH 3-LEVEL SYSTEM
// ===============================================

class Logger {
    constructor(level = 'info') {
        this.level = level;
        this.output = [];
    }

    info(message) {
        this.output.push(`ℹ️  ${message}`);
    }

    extended(message) {
        if (['extended', 'debug'].includes(this.level)) {
            this.output.push(`📊 ${message}`);
        }
    }

    debug(message) {
        if (this.level === 'debug') {
            this.output.push(`🔍 ${message}`);
        }
    }

    warn(message) {
        this.output.push(`⚠️  ${message}`);
    }

    error(message) {
        this.output.push(`❌ ${message}`);
    }

    success(message) {
        this.output.push(`✅ ${message}`);
    }

    section(title) {
        this.output.push(`\n🎯 ${title}`);
        this.output.push('─'.repeat(50));
    }

    subsection(title) {
        this.output.push(`\n📋 ${title}:`);
    }

    getOutput() {
        return this.output.join('\n');
    }

    clear() {
        this.output = [];
    }
}

// ===============================================
// OS DETECTION AND FFMPEG PATH RESOLUTION
// ===============================================

const detectOperatingSystem = () => {
    const platform = os.platform();
    
    if (platform === 'win32') {
        return 'windows';
    } else if (platform === 'linux') {
        try {
            if (fs.existsSync('/.dockerenv')) {
                return 'docker';
            }
            
            if (fs.existsSync('/proc/1/environ')) {
                const environ = fs.readFileSync('/proc/1/environ', 'utf8');
                if (environ.includes('container=lxc')) {
                    return 'lxc';
                }
            }
            
            if (fs.existsSync('/proc/1/cgroup')) {
                const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
                if (cgroup.includes('docker')) {
                    return 'docker';
                } else if (cgroup.includes('lxc')) {
                    return 'lxc';
                }
            }
            
            return 'linux';
        } catch (error) {
            return 'linux';
        }
    } else if (platform === 'darwin') {
        return 'macos';
    } else {
        return 'unix';
    }
};

const getFFmpegPath = (inputs, logger) => {
    const osType = detectOperatingSystem();
    
    logger.debug(`Operating system detected: ${osType}`);
    
    if (osType === 'windows') {
        const winPath = inputs.ffmpegPathWindows || 'ffmpeg.exe';
        logger.debug(`Using Windows FFmpeg path: ${winPath}`);
        return winPath;
    } else {
        const linuxPath = inputs.ffmpegPath || 'ffmpeg';
        logger.debug(`Using Linux/Unix FFmpeg path: ${linuxPath}`);
        return linuxPath;
    }
};

// ===============================================
// CODEC DETECTION AND RENAMING FUNCTIONS
// ===============================================

// HDR Detection
const detectHDR = (videoStream) => {
    if (!videoStream) return null;
    
    const { color_transfer, color_primaries, side_data_list } = videoStream;
    
    if (side_data_list && side_data_list.some(data => 
        data.side_data_type === 'DOVI configuration record')) {
        return 'DV';
    }
    
    if (side_data_list && side_data_list.some(data => 
        data.side_data_type === 'HDR Dynamic Metadata SMPTE2094-40')) {
        return 'HDR10+';
    }
    
    if (color_transfer === 'smpte2084' || color_primaries === 'bt2020') {
        return 'HDR10';
    }
    
    return null;
};

// Dolby Atmos Detection
const detectDolbyAtmos = (streams) => {
    return streams.some(stream => {
        if (stream.codec_type !== 'audio') return false;
        
        if (stream.tags?.title && typeof stream.tags.title === 'string') {
            if (stream.tags.title.toLowerCase().includes('atmos')) {
                return true;
            }
        }
        
        if (stream.codec_long_name && typeof stream.codec_long_name === 'string') {
            if (stream.codec_long_name.toLowerCase().includes('atmos')) {
                return true;
            }
        }
        
        if (stream.channel_layout && typeof stream.channel_layout === 'string') {
            const atmosLayouts = ['7.1.4', '5.1.4', '7.1.2', '5.1.2'];
            if (atmosLayouts.some(layout => stream.channel_layout.includes(layout))) {
                return true;
            }
        }
        
        if (stream.disposition && typeof stream.disposition === 'object') {
            for (const [key, value] of Object.entries(stream.disposition)) {
                if (typeof value === 'string' && value.toLowerCase().includes('atmos')) {
                    return true;
                }
            }
        }
        
        return false;
    });
};

// Channel count mapping for naming
const getChannelCount = (channels) => {
    const channelMap = {
        1: '1.0', 2: '2.0', 3: '2.1', 4: '4.0', 5: '4.1', 6: '5.1', 
        7: '6.1', 8: '7.1', 10: '9.1', 12: '11.1', 16: '7.1.4'
    };
    return channelMap[channels] || `${channels}ch`;
};

// Video codec mappings
const VIDEO_CODEC_MAPS = {
    standard: {
        av01: 'AV1', av1: 'AV1', vp9: 'VP9', vp8: 'VP8',
        hevc: 'H.265', h265: 'H.265', x265: 'H.265',
        avc: 'H.264', h264: 'H.264', x264: 'H.264',
        mpeg2video: 'MPEG-2', mpeg4: 'MPEG-4', xvid: 'XviD', divx: 'DivX',
    },
    detailed: {
        av01: 'AV1-Main', av1: 'AV1-Main', vp9: 'VP9-Profile0', vp8: 'VP8',
        hevc: 'H.265-Main10', h265: 'H.265-Main10', x265: 'H.265-Main10',
        avc: 'H.264-High', h264: 'H.264-High', x264: 'H.264-High',
        mpeg2video: 'MPEG-2', mpeg4: 'MPEG-4-ASP',
    },
    short: {
        av01: 'av1', av1: 'av1', vp9: 'vp9', vp8: 'vp8',
        hevc: 'x265', h265: 'x265', x265: 'x265',
        avc: 'x264', h264: 'x264', x264: 'x264',
        mpeg2video: 'mpeg2', mpeg4: 'xvid',
    },
};

// Audio codec mappings
const AUDIO_CODEC_MAP = {
    opus: 'Opus', flac: 'FLAC',
    eac3: 'EAC-3', 'eac-3': 'EAC-3', ac3: 'AC-3', 'ac-3': 'AC-3', truehd: 'TrueHD',
    dts: 'DTS', 'dts-hd': 'DTS-HD', 'dts-hd ma': 'DTS-HD MA', 'dts-hd hra': 'DTS-HD HRA',
    'dts-es': 'DTS-ES', 'dts express': 'DTS Express', 'dts 96/24': 'DTS 96/24',
    aac: 'AAC', mp3: 'MP3', mp2: 'MP2', vorbis: 'Vorbis',
    pcm_s16le: 'PCM', pcm_s24le: 'PCM-24',
};

// Resolution detection
const detectResolution = (videoStream, resolutionFormat = 'standard') => {
    if (!videoStream || !videoStream.width || !videoStream.height) return null;
    
    const width = videoStream.width;
    const height = videoStream.height;
    
    const resolutionMaps = {
        standard: {
            7680: '8K', 4320: '4320p',
            3840: '4K', 2560: '1440p',
            1920: '1080p', 1280: '720p',
            720: '576p', 854: '480p', 640: '480p', 480: '360p', 320: '240p'
        },
        marketing: {
            7680: '8K UHD', 4320: '8K UHD',
            3840: '4K UHD', 2560: '2K QHD',
            1920: 'Full HD', 1280: 'HD',
            720: 'PAL', 854: 'SD', 640: 'SD', 480: 'SD', 320: 'SD'
        },
        technical: {
            7680: '4320p', 4320: '4320p',
            3840: '2160p', 2560: '1440p',
            1920: '1080p', 1280: '720p',
            720: '576p', 854: '480p', 640: '480p', 480: '360p', 320: '240p'
        }
    };
    
    const resolutionMap = resolutionMaps[resolutionFormat] || resolutionMaps.standard;
    
    if (resolutionMap[width]) {
        return resolutionMap[width];
    }
    
    if (width >= 7680) {
        return resolutionFormat === 'marketing' ? '8K UHD' : 
               resolutionFormat === 'technical' ? '4320p' : '8K';
    }
    
    if (width >= 3840 && width < 7680) {
        return resolutionFormat === 'marketing' ? '4K UHD' : 
               resolutionFormat === 'technical' ? '2160p' : '4K';
    }
    
    if (width >= 2560 && width < 3840) {
        return resolutionFormat === 'marketing' ? '2K QHD' : '1440p';
    }
    
    if (width >= 1920 && width < 2560) {
        return resolutionFormat === 'marketing' ? 'Full HD' : '1080p';
    }
    
    if (width >= 1280 && width < 1920) {
        return resolutionFormat === 'marketing' ? 'HD' : '720p';
    }
    
    if (width >= 720 && width < 1280) {
        return resolutionFormat === 'marketing' ? 'PAL' : '576p';
    }
    
    if (width >= 640 && width < 720) {
        return resolutionFormat === 'marketing' ? 'SD' : '480p';
    }
    
    if (width >= 480 && width < 640) {
        return '360p';
    }
    
    if (width >= 320 && width < 480) {
        return '240p';
    }
    
    if (width < 320) {
        return '144p';
    }
    
    if (height >= 2160) return resolutionFormat === 'technical' ? '2160p' : '4K';
    if (height >= 1440) return '1440p';
    if (height >= 1080) return '1080p';
    if (height >= 720) return '720p';
    if (height >= 576) return '576p';
    if (height >= 480) return '480p';
    if (height >= 360) return '360p';
    if (height >= 240) return '240p';
    
    return '144p';
};

// Regex patterns for codec detection
const createVideoRegex = () => {
    const patterns = [
        'AV1', 'VP9', 'VP8',
        'H\\.?265', 'HEVC', '[xX]265',
        'H\\.?264', 'AVC', '[xX]264',
        'MPEG-?[24]', 'XviD', 'DivX'
    ];
    return new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi');
};

const createAudioRegex = () => {
    const patterns = [
        'Opus\\d+\\.\\d+', 'Opus\\d+ch', 'Opus', 'FLAC', 'DTS[:\\-]?X', 'Atmos',
        'DDP\\d+\\.\\d+', 'DDP\\d+ch', 'DDP', 
        'TrueHD\\d+\\.\\d+', 'TrueHD\\d+ch', 'TrueHD', 
        'EAC[\\-]?3\\d+\\.\\d+', 'EAC[\\-]?3\\d+ch', 'EAC[\\-]?3', 
        'AC[\\-]?3\\d+\\.\\d+', 'AC[\\-]?3\\d+ch', 'AC[\\-]?3',
        'DTS[\\-\\s]HD[\\s\\-]MA\\d+\\.\\d+', 'DTS[\\-\\s]HD[\\s\\-]MA\\d+ch', 'DTS[\\-\\s]HD[\\s\\-]MA', 
        'DTS[\\-\\s]HD[\\s\\-]HRA\\d+\\.\\d+', 'DTS[\\-\\s]HD[\\s\\-]HRA\\d+ch', 'DTS[\\-\\s]HD[\\s\\-]HRA', 
        'DTS[\\-\\s]HD\\d+\\.\\d+', 'DTS[\\-\\s]HD\\d+ch', 'DTS[\\-\\s]HD', 
        'DTS[\\-\\s]ES\\d+\\.\\d+', 'DTS[\\-\\s]ES\\d+ch', 'DTS[\\-\\s]ES',
        'DTS[\\s]Express', 'DTS[\\s]96\\/24', 'DTS\\d+\\.\\d+', 'DTS\\d+ch', 'DTS',
        'AAC\\d+\\.\\d+', 'AAC\\d+ch', 'AAC', 
        'MP[23]\\d+\\.\\d+', 'MP[23]\\d+ch', 'MP[23]', 
        'Vorbis', 'PCM[\\-]?24?'
    ];
    return new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi');
};

const createResolutionRegex = () => {
    const patterns = [
        '8K\\s?UHD', '4K\\s?UHD', '2K\\s?QHD', 'Full\\s?HD', 'WSXGA\\+', 'HD\\+',
        '[48]K', '\\d{3,4}p', '\\d{4}x\\d{4}', '\\d{3,4}x\\d{3,4}',
        'UHD', 'QHD', 'WXGA', 'SVGA', 'VGA', 'CIF', 'QVGA', 'PAL', 'NTSC'
    ];
    return new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi');
};

// Custom tag processing
const addCustomTag = (filename, tag, position) => {
    if (!tag || tag.trim() === '') return filename;
    
    const cleanTag = tag.trim();
    
    if (filename.includes(cleanTag)) {
        return filename;
    }
    
    const parsedPath = path.parse(filename);
    const nameWithoutExt = parsedPath.name;
    const extension = parsedPath.ext;
    
    let newName;
    
    switch (position) {
        case 'after_title':
            const titleMatch = nameWithoutExt.match(/^([^.]+(?:\.[^.]*?)?)\s*[\.\s]*(\d{4}|[Ss]\d{2}[Ee]\d{2}|[xX]26[45]|[Hh]\.?26[45]|AV1|VP9)/);
            if (titleMatch) {
                newName = `${titleMatch[1]}.${cleanTag}.${nameWithoutExt.substring(titleMatch[1].length + 1)}`;
            } else {
                const parts = nameWithoutExt.split('.');
                if (parts.length > 1) {
                    newName = `${parts[0]}.${cleanTag}.${parts.slice(1).join('.')}`;
                } else {
                    newName = `${nameWithoutExt}.${cleanTag}`;
                }
            }
            break;
            
        case 'before_codecs':
            const codecMatch = nameWithoutExt.match(/^(.+?)[\.\s]*([xX]26[45]|[Hh]\.?26[45]|AV1|VP9|AAC|AC-?3|DTS|TrueHD|\d{3,4}p|4K|HD)/);
            if (codecMatch) {
                newName = `${codecMatch[1]}.${cleanTag}.${nameWithoutExt.substring(codecMatch[1].length + 1)}`;
            } else {
                newName = `${nameWithoutExt}.${cleanTag}`;
            }
            break;
            
        case 'end':
        default:
            newName = `${nameWithoutExt}.${cleanTag}`;
            break;
    }
    
    return path.join(parsedPath.dir, newName + extension);
};

// Intelligent codec insertion
const insertMissingCodecInfo = (filename, codecInfo, logger, sessionRenames = {}) => {
    const parsedPath = path.parse(filename);
    const nameWithoutExt = parsedPath.name;
    const extension = parsedPath.ext;
    
    const insertionOrder = ['audioWithChannels', 'hdr', 'resolution', 'video', 'custom'];
    const missingCodecs = [];
    const existingCodecs = [];
    
    logger.debug('🔧 Starting codec insertion analysis...');
    
    for (const codecType of insertionOrder) {
        let actualCodecType = codecType;
        let codecValue = null;
        
        if (codecType === 'audioWithChannels') {
            if (codecInfo.audioWithChannels && codecInfo.audioWithChannels.value) {
                codecValue = codecInfo.audioWithChannels.value;
                actualCodecType = 'audio';
            }
        } else if (codecInfo[codecType] && codecInfo[codecType].value) {
            codecValue = codecInfo[codecType].value;
        }
        
        if (codecValue) {
            const bracketedValue = `[${codecValue}]`;
            
            let alreadyExists = false;
            
            if (sessionRenames[actualCodecType]) {
                alreadyExists = true;
                logger.debug(`🔍 ${actualCodecType} codec already renamed in this session: ${codecValue}`);
            } else {
                const existsInBrackets = nameWithoutExt.includes(bracketedValue);
                
                let existsWithoutBrackets = false;
                
                if (codecType === 'audioWithChannels') {
                    const baseCodec = codecValue.split(' ')[0];
                    existsWithoutBrackets = nameWithoutExt.toLowerCase().includes(baseCodec.toLowerCase());
                    logger.debug(`🔍 Checking audio codec: looking for "${baseCodec}" in filename`);
                } else if (codecType === 'resolution') {
                    const resolutionVariants = [
                        codecValue,
                        codecValue.replace('p', ''),
                        codecValue.toLowerCase(),
                        codecValue.toUpperCase()
                    ];
                    existsWithoutBrackets = resolutionVariants.some(variant => 
                        nameWithoutExt.toLowerCase().includes(variant.toLowerCase())
                    );
                    logger.debug(`🔍 Checking resolution: looking for variants of "${codecValue}" in filename`);
                } else if (codecType === 'video') {
                    const videoVariants = [
                        codecValue,
                        codecValue.replace('.', ''),
                        codecValue.replace('H.', 'x'),
                        codecValue.toLowerCase(),
                        codecValue.toUpperCase()
                    ];
                    existsWithoutBrackets = videoVariants.some(variant => 
                        nameWithoutExt.toLowerCase().includes(variant.toLowerCase())
                    );
                    logger.debug(`🔍 Checking video codec: looking for variants of "${codecValue}" in filename`);
                } else {
                    existsWithoutBrackets = nameWithoutExt.toLowerCase().includes(codecValue.toLowerCase());
                    logger.debug(`🔍 Checking ${codecType}: looking for "${codecValue}" in filename`);
                }
                
                alreadyExists = existsInBrackets || existsWithoutBrackets;
            }
            
            if (alreadyExists) {
                existingCodecs.push({
                    type: codecType,
                    value: codecValue,
                    existing: true
                });
                logger.debug(`🔍 ${codecType} codec already exists: ${codecValue}`);
            } else {
                missingCodecs.push({
                    type: codecType,
                    value: codecValue,
                    bracketed: bracketedValue
                });
                logger.debug(`➕ ${codecType} codec missing, will add: ${bracketedValue}`);
            }
        }
    }
    
    if (missingCodecs.length === 0) {
        logger.debug('✅ All codec information already present in filename');
        return filename;
    }
    
    let newName = nameWithoutExt;
    
    for (const missing of missingCodecs) {
        newName += `.${missing.bracketed}`;
        const displayType = missing.type === 'audioWithChannels' ? 'audio' : missing.type;
        logger.info(`🔧 Adding missing ${displayType}: ${missing.bracketed}`);
    }
    
    logger.success(`🔧 Codec insertion completed: ${missingCodecs.length} codec(s) added`);
    
    return path.join(parsedPath.dir, newName + extension);
};

// Process additional files
const processAdditionalFiles = (args, originalFilePath, newFilePath, logger) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const originalBasename = path.basename(originalFilePath);
        const newBasename = path.basename(newFilePath);
        const justName = path.parse(originalBasename).name;
        const newJustName = path.parse(newBasename).name;
        const fileDir = path.dirname(originalFilePath);
        
        const popJustName = justName.split('.');
        popJustName.splice(popJustName.length - 5);
        const modJustName = popJustName.join('.');
        
        const extensionList = args.inputs.additional_extensions.split(',')
            .map(ext => ext.trim());
        const regex = new RegExp(`\\.(${extensionList.map(e => e.replace('.', '')).join('|')})$`, 'i');
        
        logger.extended(`📁 Processing additional files in: ${fileDir}`);
        logger.debug(`🔍 Looking for files starting with: ${modJustName}`);
        
        if (fs.existsSync(fileDir)) {
            const files = fs.readdirSync(fileDir);
            let processedCount = 0;
            
            for (const supportFile of files) {
                if (supportFile.startsWith(modJustName) && regex.test(supportFile)) {
                    const supportExt = path.extname(supportFile);
                    const supportNameWithoutExt = path.parse(supportFile).name;
                    
                    const newSupportName = supportNameWithoutExt.replace(justName, newJustName) + supportExt;
                    
                    const oldPath = path.join(fileDir, supportFile);
                    const newPath = path.join(fileDir, newSupportName);
                    
                    if (newSupportName !== supportFile) {
                        if (fs.existsSync(newPath) && newPath !== oldPath) {
                            logger.warn(`Target file already exists, skipping: ${newPath}`);
                        } else {
                            try {
                                fs.renameSync(oldPath, newPath);
                                logger.extended(`📝 Renamed: ${supportFile} → ${newSupportName}`);
                                processedCount++;
                            } catch (error) {
                                logger.warn(`Error renaming ${oldPath}: ${error.message}`);
                            }
                        }
                    }
                }
            }
            
            if (processedCount > 0) {
                logger.success(`📝 Successfully renamed ${processedCount} additional file(s)`);
            } else {
                logger.extended('📝 No additional files needed renaming');
            }
        }
    } catch (error) {
        logger.warn(`Error processing additional files: ${error.message}`);
    }
});

// ===============================================
// MAIN PLUGIN FUNCTION
// ===============================================

const plugin = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lib = require('../../../../../methods/lib')();
        
        args.inputs = lib.loadDefaultValues(args.inputs, details);
        
        const logger = new Logger(args.inputs.logging_level);
        
        const startTime = Date.now();
        const processingMetrics = {
            renamingTime: 0,
            totalTime: 0
        };

        let renamingChanges = { 
            video: false, 
            audio: false, 
            resolution: false, 
            customTag: false, 
            codecInsertion: false,
            dotCleaning: false
        };
        
        const sessionRenames = {
            video: false,
            audio: false, 
            resolution: false,
            custom: false,
            hdr: false
        };
        
        let additionalFilesCount = 0;
        let fileNeedsRenaming = false;
        let newFileName = '';

        if (args.inputFileObj.fileMedium !== 'video') {
            logger.warn('Not a video file. Skipping.');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        logger.section('DeNiX File Renaming: Modern Codec Detection & Intelligent Naming');
        logger.info(`📁 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`📊 Container: ${args.inputFileObj.container} | Streams: ${args.inputFileObj.ffProbeData.streams.length}`);

        const ffmpegPath = getFFmpegPath(args.inputs, logger);
        logger.debug(`FFmpeg path: ${ffmpegPath}`);

        // ===============================================
        // STEP 1: ENHANCED FILE RENAMING
        // ===============================================
        
        logger.subsection('Step 1: Enhanced file renaming processing');
        const renamingStartTime = Date.now();
        
        const fileNameOld = args.inputFileObj._id;
        let renamedFile = fileNameOld;
        const codecsDetected = [];

        logger.debug(`🔍 Original filename: ${path.basename(fileNameOld)}`);

        if (args.inputs.remove_dots_before_release_tags) {
            renamedFile = renamedFile.replace(/\.(\-[^.\-][^.]*)/g, '$1');
            renamingChanges.dotCleaning = true;
            codecsDetected.push('Dot cleaning: Removed dots before release tags');
            logger.info('🧹 Cleaned dots before release tags');
        }

        const videoCodecRegex = createVideoRegex();
        const audioCodecRegex = createAudioRegex();
        const resolutionRegex = createResolutionRegex();

        const codecInfo = {
            audio: { value: null, detected: false },
            hdr: { value: null, detected: false },
            resolution: { value: null, detected: false },
            video: { value: null, detected: false },
            custom: { value: null, detected: false }
        };

        // Video codec processing
        if (args.inputs.rename_video) {
            const videoStream = args.inputFileObj.ffProbeData.streams.find(stream => stream.codec_type === 'video');
            
            if (videoStream) {
                const videoCodec = videoStream.codec_name.toLowerCase();
                const codecMap = VIDEO_CODEC_MAPS[args.inputs.codec_format] || VIDEO_CODEC_MAPS.standard;
                
                if (codecMap[videoCodec]) {
                    let newCodecName = codecMap[videoCodec];
                    
                    if (args.inputs.include_hdr_info) {
                        const hdrType = detectHDR(videoStream);
                        if (hdrType) {
                            newCodecName += `-${hdrType}`;
                            codecInfo.hdr.value = hdrType;
                            codecInfo.hdr.detected = true;
                            sessionRenames.hdr = true;
                            logger.extended(`🌈 HDR detected: ${hdrType}`);
                        }
                    }
                    
                    codecInfo.video.value = newCodecName;
                    codecInfo.video.detected = true;
                    
                    if (args.inputs.preserve_existing_tags) {
                        const hasCorrectTag = renamedFile.toLowerCase().includes(newCodecName.toLowerCase());
                        if (!hasCorrectTag) {
                            renamedFile = renamedFile.replace(videoCodecRegex, newCodecName);
                            renamingChanges.video = true;
                            sessionRenames.video = true;
                            codecsDetected.push(`Video: ${videoCodec} → ${newCodecName}`);
                            logger.info(`🎬 Video codec: ${videoCodec} → ${newCodecName}`);
                        }
                    } else {
                        renamedFile = renamedFile.replace(videoCodecRegex, newCodecName);
                        renamingChanges.video = true;
                        sessionRenames.video = true;
                        codecsDetected.push(`Video: ${videoCodec} → ${newCodecName}`);
                        logger.info(`🎬 Video codec: ${videoCodec} → ${newCodecName}`);
                    }
                }
            }
        }

        // Audio codec processing
        if (args.inputs.rename_audio) {
            const audioStream = args.inputFileObj.ffProbeData.streams.find(stream => stream.codec_type === 'audio');
            
            if (audioStream) {
                const audioCodec = audioStream.codec_name.toLowerCase();
                const channels = audioStream.channels;
                
                let mappedCodec = audioCodec;
                if (audioCodec === 'dts') {
                    const profile = audioStream.profile?.toLowerCase() || '';
                    if (profile.includes('ma')) mappedCodec = 'dts-hd ma';
                    else if (profile.includes('hra')) mappedCodec = 'dts-hd hra';
                    else if (profile.includes('es')) mappedCodec = 'dts-es';
                }
                
                if (AUDIO_CODEC_MAP[mappedCodec]) {
                    const newCodecName = AUDIO_CODEC_MAP[mappedCodec];
                    
                    const hasAtmos = detectDolbyAtmos(args.inputFileObj.ffProbeData.streams);
                    
                    const finalCodecName = hasAtmos && (mappedCodec === 'truehd' || mappedCodec === 'eac3') 
                        ? newCodecName + '-Atmos' 
                        : newCodecName;
                    
                    codecInfo.audio.value = finalCodecName;
                    codecInfo.audio.detected = true;
                    
                    const channelCount = getChannelCount(channels);
                    const audioWithChannelsForInsertion = `${finalCodecName} ${channelCount}`;
                    
                    codecInfo.audioWithChannels = { 
                        value: audioWithChannelsForInsertion, 
                        detected: true 
                    };
                    
                    if (args.inputs.preserve_existing_tags) {
                        const hasCorrectTag = renamedFile.toLowerCase().includes(finalCodecName.toLowerCase());
                        if (!hasCorrectTag) {
                            renamedFile = renamedFile.replace(audioCodecRegex, finalCodecName);
                            renamingChanges.audio = true;
                            sessionRenames.audio = true;
                            codecsDetected.push(`Audio: ${audioCodec} → ${finalCodecName}`);
                            logger.info(`🎵 Audio codec: ${audioCodec} → ${finalCodecName}`);
                        }
                    } else {
                        renamedFile = renamedFile.replace(audioCodecRegex, finalCodecName);
                        renamingChanges.audio = true;
                        sessionRenames.audio = true;
                        codecsDetected.push(`Audio: ${audioCodec} → ${finalCodecName}`);
                        logger.info(`🎵 Audio codec: ${audioCodec} → ${finalCodecName}`);
                    }
                }
            }
        }

        // Resolution processing
        if (args.inputs.rename_resolution) {
            const videoStream = args.inputFileObj.ffProbeData.streams.find(stream => stream.codec_type === 'video');
            
            if (videoStream?.width && videoStream?.height) {
                const detectedResolution = detectResolution(videoStream, args.inputs.resolution_format);
                
                if (detectedResolution) {
                    codecInfo.resolution.value = detectedResolution;
                    codecInfo.resolution.detected = true;
                    
                    if (args.inputs.preserve_existing_tags) {
                        const hasCorrectResTag = renamedFile.toLowerCase().includes(detectedResolution.toLowerCase());
                        if (!hasCorrectResTag) {
                            renamedFile = renamedFile.replace(resolutionRegex, detectedResolution);
                            renamingChanges.resolution = true;
                            sessionRenames.resolution = true;
                            codecsDetected.push(`Resolution: ${videoStream.width}x${videoStream.height} → ${detectedResolution}`);
                            logger.info(`📐 Resolution: ${videoStream.width}x${videoStream.height} → ${detectedResolution}`);
                        }
                    } else {
                        renamedFile = renamedFile.replace(resolutionRegex, detectedResolution);
                        renamingChanges.resolution = true;
                        sessionRenames.resolution = true;
                        codecsDetected.push(`Resolution: ${videoStream.width}x${videoStream.height} → ${detectedResolution}`);
                        logger.info(`📐 Resolution: ${videoStream.width}x${videoStream.height} → ${detectedResolution}`);
                    }
                }
            }
        }

        // Custom tag
        if (args.inputs.custom_tag && args.inputs.custom_tag.trim() !== '') {
            const customTag = args.inputs.custom_tag.trim();
            codecInfo.custom.value = customTag;
            codecInfo.custom.detected = true;
            
            const taggedFile = addCustomTag(renamedFile, customTag, args.inputs.custom_tag_position);
            if (taggedFile !== renamedFile) {
                renamedFile = taggedFile;
                renamingChanges.customTag = true;
                sessionRenames.custom = true;
                codecsDetected.push(`Custom tag: Added "${customTag}" at ${args.inputs.custom_tag_position}`);
                logger.info(`🏷️ Custom tag: Added "${customTag}" at ${args.inputs.custom_tag_position}`);
            }
        }

        // Codec insertion
        if (args.inputs.insert_missing_codec_info) {
            logger.subsection('Codec Insertion Analysis');
            logger.debug('🔧 Analyzing filename for missing codec information...');
            
            const codecInsertedFile = insertMissingCodecInfo(renamedFile, codecInfo, logger, sessionRenames);
            
            if (codecInsertedFile !== renamedFile) {
                renamedFile = codecInsertedFile;
                renamingChanges.codecInsertion = true;
                codecsDetected.push('Codec insertion: Added missing codec info in brackets');
                logger.success('🔧 Missing codec information inserted successfully');
            } else {
                logger.info('✅ No codec insertion needed - all information already present');
            }
        }

        // Check if renaming needed
        if (renamedFile !== fileNameOld) {
            fileNeedsRenaming = true;
            newFileName = renamedFile;
            logger.success(`📝 File renaming prepared: ${path.basename(renamedFile)}`);
            logger.extended(`Changes detected: ${codecsDetected.join(', ')}`);
            
            if (args.inputs.additional_extensions) {
                logger.extended('📁 Processing additional files...');
                
                const filename = path.basename(fileNameOld);
                const justName = path.parse(filename).name;
                const fileDir = path.dirname(fileNameOld);
                
                const extensionList = args.inputs.additional_extensions.split(',')
                    .map(ext => ext.trim());
                
                logger.debug(`🔍 Looking for files with extensions: ${extensionList.join(', ')}`);
                
                try {
                    if (fs.existsSync(fileDir)) {
                        const files = fs.readdirSync(fileDir);
                        const regex = new RegExp(`\\.(${extensionList.map(e => e.replace('.', '')).join('|')})$`, 'i');
                        const matchingFiles = files.filter(file => 
                            file.startsWith(justName) && regex.test(file)
                        );
                        
                        logger.extended(`🔍 Found ${matchingFiles.length} additional files to process`);
                        additionalFilesCount = matchingFiles.length;
                    }
                } catch (error) {
                    logger.warn(`Error scanning additional files: ${error.message}`);
                }
            }
        } else {
            logger.info('✅ No file renaming needed (already optimal)');
        }

        processingMetrics.renamingTime = Date.now() - renamingStartTime;
        processingMetrics.totalTime = Date.now() - startTime;

        if (!fileNeedsRenaming) {
            logger.success('No file renaming needed - file already optimal');
            
            if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
                logger.subsection('Performance Metrics');
                logger.extended(`⏱️ Renaming processing: ${processingMetrics.renamingTime}ms`);
                logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
            }
            
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        // ===============================================
        // STEP 2: EXECUTE FILE COPY WITH NEW NAME
        // ===============================================
        
        logger.subsection('Step 2: Executing file renaming');
        
        const outputFilePath = `${(0, fileUtils_1.getPluginWorkDir)(args)}/${path.basename(newFileName)}`;
        
        const ffmpegArgs = [
			'-i', args.inputFileObj._id,
			'-map', '0',
			'-c', 'copy',
			'-map_metadata', '0',
			'-max_muxing_queue_size', '9999',
			outputFilePath
		];

        logger.success('FFmpeg command built successfully');
        logger.extended(`Output path: ${outputFilePath}`);
        
        if (args.inputs.logging_level === 'debug') {
            logger.debug(`Full FFmpeg command: ${ffmpegArgs.join(' ')}`);
        }

        if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Renaming processing: ${processingMetrics.renamingTime}ms`);
            logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
        }

        logger.success('🚀 Executing FFmpeg processing...');
        args.jobLog(logger.getOutput());

        const cli = new cliUtils_1.CLI({
            cli: ffmpegPath,
            spawnArgs: ffmpegArgs,
            spawnOpts: {},
            jobLog: args.jobLog,
            outputFilePath,
            inputFileObj: args.inputFileObj,
            logFullCliOutput: args.logFullCliOutput,
            updateWorker: args.updateWorker,
            args,
        });

        const res = yield cli.runCli();

        if (res.cliExitCode !== 0) {
            logger.error(`FFmpeg failed with exit code: ${res.cliExitCode}`);
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

        logger.success('FFmpeg processing completed successfully');

        if (additionalFilesCount > 0) {
            yield processAdditionalFiles(args, args.inputFileObj._id, outputFilePath, logger);
        }

        logger.success('✅ File renaming complete!');
        logger.info('📄 Processing pipeline complete');
        logger.info('=== End of File Renaming ===');

        args.jobLog(logger.getOutput());

        return {
            outputFileObj: {
                _id: outputFilePath,
            },
            outputNumber: 1,
            variables: args.variables,
        };

    } catch (error) {
        const logger = new Logger('info');
        logger.error(`Plugin execution failed: ${error.message}`);
        if (error.stack) {
            logger.debug(`Stack trace: ${error.stack}`);
        }
        args.jobLog(logger.getOutput());
        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 3,
            variables: args.variables,
        };
    }
});

exports.plugin = plugin;