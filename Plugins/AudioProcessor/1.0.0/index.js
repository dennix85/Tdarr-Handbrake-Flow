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
    name: '🎵 DeNiX Audio Processing: Language Detection + Opus Conversion',
    description: 'Standalone audio processing plugin with native language detection from TMDB/IMDB/Radarr/Sonarr, intelligent audio track filtering, Opus conversion with smart downmixing, and comprehensive bitrate management. Processes all matching audio tracks without extraction.',
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
    tags: 'audio,opus,conversion,language,detection,denix',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🎵',
    inputs: [
        {
            label: '🌍 Enable Language Filtering',
            name: 'enable_language_filtering',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable automatic language filtering based on native language detection from TMDB/IMDB',
        },
        {
            label: '🗣️ Additional Languages',
            name: 'user_langs',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Additional languages to keep (ISO-639-2 codes, comma-separated). Example: nld,nor,ger',
        },
        {
            label: '🔑 TMDB API Key',
            name: 'tmdb_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'TMDB API v3 key for automatic language detection (https://www.themoviedb.org/)',
        },
        {
            label: '🎯 Service Priority',
            name: 'priority',
            type: 'string',
            defaultValue: 'Radarr',
            inputUI: {
                type: 'dropdown',
                options: ['Radarr', 'Sonarr'],
            },
            tooltip: 'Priority service for metadata lookup - try Radarr or Sonarr first',
        },
        {
            label: '🎬 Radarr API Key 1',
            name: 'radarr_api_key_1',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Primary Radarr instance API key',
        },
        {
            label: '🎬 Radarr URL 1',
            name: 'radarr_url_1',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Primary Radarr URL (e.g., localhost:7878)',
        },
        {
            label: '🎬 Radarr API Key 2',
            name: 'radarr_api_key_2',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Secondary Radarr instance API key',
        },
        {
            label: '🎬 Radarr URL 2',
            name: 'radarr_url_2',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Secondary Radarr URL (e.g., localhost:7879)',
        },
        {
            label: '📺 Sonarr API Key 1',
            name: 'sonarr_api_key_1',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Primary Sonarr instance API key',
        },
        {
            label: '📺 Sonarr URL 1',
            name: 'sonarr_url_1',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Primary Sonarr URL (e.g., localhost:8989)',
        },
        {
            label: '📺 Sonarr API Key 2',
            name: 'sonarr_api_key_2',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Secondary Sonarr instance API key',
        },
        {
            label: '📺 Sonarr URL 2',
            name: 'sonarr_url_2',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Secondary Sonarr URL (e.g., localhost:8990)',
        },
        {
            label: '🎵 Enable Audio Conversion',
            name: 'enable_audio_conversion',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable audio conversion to Opus with intelligent per-stream channel mapping and downmixing',
        },
        {
            label: '📊 Keep 7.1 as 7.1',
            name: 'keep_71_as_71',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Keep 7.1 tracks as 7.1 instead of downmixing to 5.1 (disabled = default: 7.1 → 5.1)',
        },
        {
            label: '📽 Create 5.1 from 7.1+',
            name: 'create_51_from_71',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Create a 5.1 track when 7.1+ exists (keeps original + adds 5.1 downmix)',
        },
        {
            label: '📽 Create 2.0 if Missing',
            name: 'create_20_if_missing',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Create a 2.0 stereo track if none exists (from highest channel source)',
        },
        {
            label: '🎭 Ignore Commentary',
            name: 'ignore_commentary',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Ignore commentary tracks for analysis (converts to Opus but excludes from processing logic)',
        },
        {
            label: '🗑️ Remove Commentary Audio',
            name: 'remove_commentary_audio',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Remove commentary audio tracks from output file entirely',
        },
        {
            label: '📊 Mono/Stereo Low Quality',
            name: 'mono_stereo_target_low',
            type: 'number',
            defaultValue: 56,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for mono/stereo LOW quality tracks (0-128 kbps source) - Default: 56 kbps',
        },
        {
            label: '📊 Mono/Stereo Medium Quality',
            name: 'mono_stereo_target_medium',
            type: 'number',
            defaultValue: 64,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for mono/stereo MEDIUM quality tracks (129-192 kbps source) - Default: 64 kbps',
        },
        {
            label: '📊 Mono/Stereo High Quality',
            name: 'mono_stereo_target_high',
            type: 'number',
            defaultValue: 72,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for mono/stereo HIGH quality tracks (193-384 kbps source) - Default: 72 kbps',
        },
        {
            label: '📊 Mono/Stereo Very High Quality',
            name: 'mono_stereo_target_veryhigh',
            type: 'number',
            defaultValue: 96,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for mono/stereo VERY HIGH quality tracks (385+ kbps source) - Default: 96 kbps',
        },
        {
            label: '📊 Multi-Channel Low Quality',
            name: 'multichannel_target_low',
            type: 'number',
            defaultValue: 64,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for multi-channel LOW quality tracks (0-128 kbps source) - Default: 64 kbps',
        },
        {
            label: '📊 Multi-Channel Medium Quality',
            name: 'multichannel_target_medium',
            type: 'number',
            defaultValue: 96,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for multi-channel MEDIUM quality tracks (129-320 kbps source) - Default: 96 kbps',
        },
        {
            label: '📊 Multi-Channel High Quality',
            name: 'multichannel_target_high',
            type: 'number',
            defaultValue: 128,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for multi-channel HIGH quality tracks (321-640 kbps source) - Default: 128 kbps',
        },
        {
            label: '📊 Multi-Channel Very High Quality',
            name: 'multichannel_target_veryhigh',
            type: 'number',
            defaultValue: 256,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for multi-channel VERY HIGH quality tracks (641-1024 kbps source) - Default: 256 kbps',
        },
        {
            label: '📊 Multi-Channel Max Quality',
            name: 'multichannel_target_max',
            type: 'number',
            defaultValue: 320,
            inputUI: { type: 'text' },
            tooltip: 'Target bitrate for multi-channel MAX quality tracks (1025+ kbps source) - Default: 320 kbps',
        },
        {
            label: '🎯 Remove Lower Quality Duplicates',
            name: 'remove_lower_quality_duplicates',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Remove lower quality audio tracks when multiple tracks exist for same language/channel combination',
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
            tooltip: 'Logging detail level: info (basic), extended (detailed), debug (full diagnostics)',
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

// IMPROVED INPUT VALIDATION CLASS
class InputValidator {
    static parseBool(value, defaultValue = false) {
        if (value === undefined || value === null) {
            return defaultValue;
        }
        
        if (typeof value === 'boolean') {
            return value;
        }
        
        if (typeof value === 'string') {
            const normalized = value.toLowerCase().trim();
            return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
        }
        
        if (typeof value === 'number') {
            return value !== 0;
        }
        
        return defaultValue;
    }
    
    static parseLanguageList(value, defaultValue = []) {
        if (!value || typeof value !== 'string') {
            return defaultValue;
        }
        
        return value.split(',')
            .map(lang => lang.trim().toLowerCase())
            .filter(lang => lang.length === 3)
            .filter(lang => LanguageMapper.isValidCode(lang));
    }
    
    static parseNumber(value, defaultValue = 0, min = null, max = null) {
        let result = defaultValue;
        
        if (typeof value === 'number') {
            result = value;
        } else if (typeof value === 'string') {
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed)) {
                result = parsed;
            }
        }
        
        if (min !== null && result < min) {
            result = min;
        }
        
        if (max !== null && result > max) {
            result = max;
        }
        
        return result;
    }
}

// IMPROVED ASYNC ERROR HANDLING CLASS
class AsyncHandler {
    static async withTimeout(promise, timeoutMs, description = 'Operation') {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`${description} timed out after ${timeoutMs}ms`)), timeoutMs);
        });
        
        return Promise.race([promise, timeoutPromise]);
    }
    
    static async withRetry(asyncFn, maxRetries = 3, delayMs = 1000, description = 'Operation') {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await asyncFn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxRetries) {
                    throw new Error(`${description} failed after ${maxRetries} attempts: ${error.message}`);
                }
                
                await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
            }
        }
        
        throw lastError;
    }
    
    static async safeExecute(asyncFn, defaultValue = null, logger = null) {
        try {
            return await asyncFn();
        } catch (error) {
            if (logger) {
                logger.warn(`Safe execution failed: ${error.message}`);
            }
            return defaultValue;
        }
    }
}

// IMPROVED LOGGER WITH 3-LEVEL SYSTEM
class Logger {
    constructor(level = 'info') {
        this.level = level;
        this.output = [];
    }

    info(message) {
        this.output.push(`ℹ️  ${message}`);
    }

    extended(message) {
        if (this.level === 'extended' || this.level === 'debug') {
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

    api(message) {
        if (this.level === 'extended' || this.level === 'debug') {
            this.output.push(`🌐 ${message}`);
        }
    }

    language(message) {
        this.output.push(`🗣️ ${message}`);
    }

    section(title) {
        this.output.push(`\n🎯 ${title}`);
        this.output.push('─'.repeat(50));
    }

    subsection(title) {
        this.output.push(`\n📋 ${title}:`);
    }

    banner(title) {
        this.output.push(`\n${'='.repeat(50)}`);
        this.output.push(`🎉 ${title}`);
        this.output.push(`${'='.repeat(50)}`);
    }

    getOutput() {
        return this.output.join('\n');
    }

    clear() {
        this.output = [];
    }
}

// OS DETECTION AND FFMPEG PATH RESOLUTION
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

// LANGUAGE MAPPING
const languageMapping = {
    'aa': 'aar', 'ab': 'abk', 'ae': 'ave', 'af': 'afr', 'ak': 'aka', 
    'am': 'amh', 'an': 'arg', 'ar': 'ara', 'as': 'asm', 'av': 'ava',
    'ay': 'aym', 'az': 'aze', 'ba': 'bak', 'be': 'bel', 'bg': 'bul',
    'bh': 'bih', 'bi': 'bis', 'bm': 'bam', 'bn': 'ben', 'bo': 'tib',
    'br': 'bre', 'bs': 'bos', 'ca': 'cat', 'ce': 'che', 'ch': 'cha',
    'co': 'cos', 'cr': 'cre', 'cs': 'cze', 'cu': 'chu', 'cv': 'chv',
    'cy': 'wel', 'da': 'dan', 'de': 'ger', 'dv': 'div', 'dz': 'dzo',
    'ee': 'ewe', 'el': 'gre', 'en': 'eng', 'eo': 'epo', 'es': 'spa',
    'et': 'est', 'eu': 'baq', 'fa': 'per', 'ff': 'ful', 'fi': 'fin',
    'fj': 'fij', 'fo': 'fao', 'fr': 'fre', 'fy': 'fry', 'ga': 'gle',
    'gd': 'gla', 'gl': 'glg', 'gn': 'grn', 'gu': 'guj', 'gv': 'glv',
    'ha': 'hau', 'he': 'heb', 'hi': 'hin', 'ho': 'hmo', 'hr': 'hrv',
    'ht': 'hat', 'hu': 'hun', 'hy': 'arm', 'hz': 'her', 'ia': 'ina',
    'id': 'ind', 'ie': 'ile', 'ig': 'ibo', 'ii': 'iii', 'ik': 'ipk',
    'io': 'ido', 'is': 'ice', 'it': 'ita', 'iu': 'iku', 'ja': 'jpn',
    'jv': 'jav', 'ka': 'geo', 'kg': 'kon', 'ki': 'kik', 'kj': 'kua',
    'kk': 'kaz', 'kl': 'kal', 'km': 'khm', 'kn': 'kan', 'ko': 'kor',
    'kr': 'kau', 'ks': 'kas', 'ku': 'kur', 'kv': 'kom', 'kw': 'cor',
    'ky': 'kir', 'la': 'lat', 'lb': 'ltz', 'lg': 'lug', 'li': 'lim',
    'ln': 'lin', 'lo': 'lao', 'lt': 'lit', 'lu': 'lub', 'lv': 'lav',
    'mg': 'mlg', 'mh': 'mah', 'mi': 'mao', 'mk': 'mac', 'ml': 'mal',
    'mn': 'mon', 'mr': 'mar', 'ms': 'may', 'mt': 'mlt', 'my': 'bur',
    'na': 'nau', 'nb': 'nob', 'nd': 'nde', 'ne': 'nep', 'ng': 'ndo',
    'nl': 'dut', 'nn': 'nno', 'no': 'nor', 'nr': 'nbl', 'nv': 'nav',
    'ny': 'nya', 'oc': 'oci', 'oj': 'oji', 'om': 'orm', 'or': 'ori',
    'os': 'oss', 'pa': 'pan', 'pi': 'pli', 'pl': 'pol', 'ps': 'pus',
    'pt': 'por', 'qu': 'que', 'rm': 'roh', 'rn': 'run', 'ro': 'rum',
    'ru': 'rus', 'rw': 'kin', 'sa': 'san', 'sc': 'srd', 'sd': 'snd',
    'se': 'sme', 'sg': 'sag', 'si': 'sin', 'sk': 'slo', 'sl': 'slv',
    'sm': 'smo', 'sn': 'sna', 'so': 'som', 'sq': 'alb', 'sr': 'srp',
    'ss': 'ssw', 'st': 'sot', 'su': 'sun', 'sv': 'swe', 'sw': 'swa',
    'ta': 'tam', 'te': 'tel', 'tg': 'tgk', 'th': 'tha', 'ti': 'tir',
    'tk': 'tuk', 'tl': 'tgl', 'tn': 'tsn', 'to': 'ton', 'tr': 'tur',
    'ts': 'tso', 'tt': 'tat', 'tw': 'twi', 'ty': 'tah', 'ug': 'uig',
    'uk': 'ukr', 'ur': 'urd', 'uz': 'uzb', 've': 'ven', 'vi': 'vie',
    'vo': 'vol', 'wa': 'wln', 'wo': 'wol', 'xh': 'xho', 'yi': 'yid',
    'yo': 'yor', 'za': 'zha', 'zh': 'chi', 'zu': 'zul',
    'cn': 'chi', 'iw': 'heb', 'in': 'ind', 'ji': 'yid', 'jw': 'jav',
    'mo': 'mol', 'sh': 'srp',
};

// Enhanced Language Mapper class
class LanguageMapper {
    static getAlpha3Code(alpha2Code) {
        if (!alpha2Code || typeof alpha2Code !== 'string') {
            return 'und';
        }
        
        const normalized = alpha2Code.toLowerCase().trim();
        return languageMapping[normalized] || 'und';
    }
    
    static getLanguageName(alpha3Code) {
        const languageNames = {
            'aar': 'Afar', 'abk': 'Abkhazian', 'afr': 'Afrikaans', 'aka': 'Akan', 'alb': 'Albanian',
            'amh': 'Amharic', 'ara': 'Arabic', 'arg': 'Aragonese', 'arm': 'Armenian', 'asm': 'Assamese',
            'ava': 'Avaric', 'ave': 'Avestan', 'aym': 'Aymara', 'aze': 'Azerbaijani', 'bak': 'Bashkir',
            'bam': 'Bambara', 'baq': 'Basque', 'bel': 'Belarusian', 'ben': 'Bengali', 'bih': 'Bihari',
            'bis': 'Bislama', 'bos': 'Bosnian', 'bre': 'Breton', 'bul': 'Bulgarian', 'bur': 'Burmese',
            'cat': 'Catalan', 'cha': 'Chamorro', 'che': 'Chechen', 'chi': 'Chinese', 'chu': 'Church Slavonic',
            'chv': 'Chuvash', 'cor': 'Cornish', 'cos': 'Corsican', 'cre': 'Cree', 'hrv': 'Croatian',
            'cze': 'Czech', 'dan': 'Danish', 'div': 'Divehi', 'dut': 'Dutch', 'dzo': 'Dzongkha',
            'eng': 'English', 'epo': 'Esperanto', 'est': 'Estonian', 'ewe': 'Ewe', 'fao': 'Faroese',
            'fij': 'Fijian', 'fin': 'Finnish', 'fre': 'French', 'fry': 'Western Frisian', 'ful': 'Fulah',
            'geo': 'Georgian', 'ger': 'German', 'gla': 'Scottish Gaelic', 'gle': 'Irish', 'glg': 'Galician',
            'grn': 'Guarani', 'guj': 'Gujarati', 'glv': 'Manx', 'hau': 'Hausa', 'heb': 'Hebrew',
            'hin': 'Hindi', 'hmo': 'Hiri Motu', 'hun': 'Hungarian', 'her': 'Herero',
            'ina': 'Interlingua', 'ind': 'Indonesian', 'ile': 'Interlingue', 'ibo': 'Igbo', 'iii': 'Sichuan Yi',
            'ipk': 'Inupiaq', 'ido': 'Ido', 'ice': 'Icelandic', 'ita': 'Italian', 'iku': 'Inuktitut',
            'jpn': 'Japanese', 'jav': 'Javanese', 'kon': 'Kongo', 'kik': 'Kikuyu',
            'kua': 'Kuanyama', 'kaz': 'Kazakh', 'kal': 'Greenlandic', 'khm': 'Khmer', 'kan': 'Kannada',
            'kor': 'Korean', 'kau': 'Kanuri', 'kas': 'Kashmiri', 'kur': 'Kurdish', 'kom': 'Komi',
            'kir': 'Kyrgyz', 'lat': 'Latin', 'ltz': 'Luxembourgish', 'lug': 'Ganda',
            'lim': 'Limburgish', 'lin': 'Lingala', 'lao': 'Lao', 'lit': 'Lithuanian', 'lub': 'Luba-Katanga',
            'lav': 'Latvian', 'mlg': 'Malagasy', 'mah': 'Marshallese', 'mao': 'Maori', 'mac': 'Macedonian',
            'mal': 'Malayalam', 'mon': 'Mongolian', 'mar': 'Marathi', 'may': 'Malay', 'mlt': 'Maltese',
            'nau': 'Nauru', 'nav': 'Navajo', 'nbl': 'South Ndebele', 'nde': 'North Ndebele',
            'ndo': 'Ndonga', 'nep': 'Nepali', 'nld': 'Dutch', 'nno': 'Norwegian Nynorsk', 'nob': 'Norwegian Bokmal',
            'nor': 'Norwegian', 'nya': 'Chichewa', 'oci': 'Occitan', 'oji': 'Ojibwa', 'orm': 'Oromo',
            'ori': 'Oriya', 'oss': 'Ossetian', 'pan': 'Punjabi', 'per': 'Persian', 'pli': 'Pali',
            'pol': 'Polish', 'por': 'Portuguese', 'pus': 'Pashto', 'que': 'Quechua', 'roh': 'Romansh',
            'run': 'Rundi', 'rum': 'Romanian', 'rus': 'Russian', 'kin': 'Kinyarwanda', 'san': 'Sanskrit',
            'srd': 'Sardinian', 'snd': 'Sindhi', 'sme': 'Northern Sami', 'sag': 'Sango', 'sin': 'Sinhala',
            'slo': 'Slovak', 'slv': 'Slovenian', 'smo': 'Samoan', 'sna': 'Shona', 'som': 'Somali',
            'srp': 'Serbian', 'ssw': 'Swati', 'sot': 'Southern Sotho', 'sun': 'Sundanese',
            'swe': 'Swedish', 'swa': 'Swahili', 'tah': 'Tahitian', 'tam': 'Tamil', 'tat': 'Tatar',
            'tel': 'Telugu', 'tgk': 'Tajik', 'tgl': 'Tagalog', 'tha': 'Thai', 'tib': 'Tibetan',
            'tir': 'Tigrinya', 'ton': 'Tonga', 'tsn': 'Tswana', 'tso': 'Tsonga', 'tuk': 'Turkmen',
            'tur': 'Turkish', 'twi': 'Twi', 'uig': 'Uighur', 'ukr': 'Ukrainian',
            'und': 'Undefined', 'urd': 'Urdu', 'uzb': 'Uzbek', 'ven': 'Venda', 'vie': 'Vietnamese',
            'vol': 'Volapuk', 'wln': 'Walloon', 'wel': 'Welsh', 'wol': 'Wolof', 'xho': 'Xhosa',
            'yid': 'Yiddish', 'yor': 'Yoruba', 'zha': 'Zhuang', 'zul': 'Zulu', 'gre': 'Greek'
        };
        
        return languageNames[alpha3Code] || alpha3Code;
    }
    
    static isValidCode(code) {
        const validLanguageCodes = [
            'aar', 'abk', 'afr', 'aka', 'alb', 'amh', 'ara', 'arg', 'arm', 'asm', 'ava', 'ave', 'aym', 'aze',
            'bak', 'bam', 'baq', 'bel', 'ben', 'bih', 'bis', 'bos', 'bre', 'bul', 'bur', 'cat', 'cha', 'che',
            'chi', 'chu', 'chv', 'cor', 'cos', 'cre', 'hrv', 'cze', 'dan', 'div', 'dut', 'dzo', 'eng', 'epo',
            'est', 'ewe', 'fao', 'fij', 'fin', 'fre', 'fry', 'ful', 'geo', 'ger', 'gla', 'gle', 'glg', 'grn',
            'guj', 'hat', 'hau', 'heb', 'her', 'hin', 'hmo', 'hun', 'ice', 'ido', 'ibo', 'ina', 'ind', 'ile',
            'iku', 'ipk', 'ita', 'jav', 'jpn', 'kal', 'kan', 'kas', 'kau', 'kaz', 'khm', 'kik', 'kin', 'kir',
            'kom', 'kon', 'kor', 'kua', 'kur', 'lao', 'lat', 'lav', 'lim', 'lin', 'lit', 'lub', 'ltz', 'lug',
            'mac', 'mah', 'mal', 'mao', 'mar', 'may', 'mlg', 'mlt', 'mon', 'nau', 'nav', 'nbl', 'nde', 'ndo',
            'nep', 'nld', 'nno', 'nob', 'nor', 'nya', 'oci', 'oji', 'ori', 'orm', 'oss', 'pan', 'per', 'pli',
            'pol', 'por', 'pus', 'que', 'roh', 'rum', 'run', 'rus', 'sag', 'san', 'sin', 'slo', 'slv', 'sme',
            'smo', 'sna', 'snd', 'som', 'sot', 'spa', 'srd', 'srp', 'ssw', 'sun', 'swa', 'swe', 'tah', 'tam',
            'tat', 'tel', 'tgk', 'tgl', 'tha', 'tib', 'tir', 'ton', 'tsn', 'tso', 'tuk', 'tur', 'twi', 'uig',
            'ukr', 'und', 'urd', 'uzb', 'ven', 'vie', 'vol', 'wel', 'wol', 'xho', 'yid', 'yor', 'zha', 'zul', 'gre'
        ];
        return validLanguageCodes.includes(code.toLowerCase());
    }
}

const isValidLanguageCode = (code) => LanguageMapper.isValidCode(code);

// Enhanced IMDB ID extraction from filename
const extractImdbId = (fileName) => {
    if (!fileName || typeof fileName !== 'string') {
        return null;
    }
    
    const patterns = [
        /tt(\d{7,10})/i,
        /imdb[_-]?(\d{7,10})/i,
        /\[(tt\d{7,10})\]/i,
        /\{(tt\d{7,10})\}/i,
        /\((tt\d{7,10})\)/i,
        /(tt\d{7,10})[_\-\.\s]/i,
        /^(tt\d{7,10})$/i,
    ];

    for (const pattern of patterns) {
        const match = fileName.match(pattern);
        if (match) {
            const id = match[1] ? `tt${match[1]}` : match[0];
            return id.startsWith('tt') ? id : `tt${id}`;
        }
    }

    return null;
};

// Helper function to detect commentary tracks
const isCommentaryTrack = (stream) => {
    if (!stream.tags) return false;
    
    const title = stream.tags.title?.toLowerCase() || '';
    const language = stream.tags.language?.toLowerCase() || '';
    
    const commentaryKeywords = [
        'commentary', 'comment', 'director', 'cast', 'crew', 'making of',
        'behind the scenes', 'interview', 'featurette', 'audio commentary',
        'directors commentary', 'filmmaker commentary', 'producer commentary',
        'writer commentary', 'commentary track', 'audio description'
    ];
    
    return commentaryKeywords.some(keyword => 
        title.includes(keyword) || 
        (language && language.includes('commentary'))
    );
};

// Helper function to create stereo downmix filter
const createStereoDownmixFilter = (channels) => {
    if (channels === 6) { // 5.1
        return "pan=stereo|FL=0.5*FL+0.707*FC+0.5*BL|FR=0.5*FR+0.707*FC+0.5*BR";
    } else if (channels === 8) { // 7.1
        return "pan=stereo|FL=0.374*FL+0.531*FC+0.374*BL+0.265*SL|FR=0.374*FR+0.531*FC+0.374*BR+0.265*SR";
    } else if (channels > 8) { // 9.1, 10.x etc
        return "pan=stereo|FL=0.3*FL+0.5*FC+0.3*BL+0.2*SL|FR=0.3*FR+0.5*FC+0.3*BR+0.2*SR";
    } else {
        return "pan=stereo|FL=0.5*FL+0.707*FC+0.5*BL|FR=0.5*FR+0.707*FC+0.5*BR";
    }
};

// Bitrate calculation helper function
const calculateTargetBitrate = (channels, sourceBitrateKbps, inputs) => {
    const BITRATE_BOUNDARIES = {
        MONO_STEREO: {
            LOW: 128,
            MEDIUM: 192,
            HIGH: 384
        },
        MULTICHANNEL: {
            LOW: 128,
            MEDIUM: 320,
            HIGH: 640,
            VERYHIGH: 1024
        }
    };

    const TARGET_BITRATES = {
        MONO_STEREO: {
            LOW: `${inputs.mono_stereo_target_low}k`,
            MEDIUM: `${inputs.mono_stereo_target_medium}k`,
            HIGH: `${inputs.mono_stereo_target_high}k`,
            VERYHIGH: `${inputs.mono_stereo_target_veryhigh}k`
        },
        MULTICHANNEL: {
            LOW: `${inputs.multichannel_target_low}k`,
            MEDIUM: `${inputs.multichannel_target_medium}k`,
            HIGH: `${inputs.multichannel_target_high}k`,
            VERYHIGH: `${inputs.multichannel_target_veryhigh}k`,
            MAX: `${inputs.multichannel_target_max}k`
        }
    };

    let targetBitrate = TARGET_BITRATES.MONO_STEREO.LOW;

    if (channels <= 2) {
        if (sourceBitrateKbps === 0) {
            targetBitrate = TARGET_BITRATES.MONO_STEREO.LOW;
        } else if (sourceBitrateKbps <= BITRATE_BOUNDARIES.MONO_STEREO.LOW) {
            targetBitrate = TARGET_BITRATES.MONO_STEREO.LOW;
        } else if (sourceBitrateKbps <= BITRATE_BOUNDARIES.MONO_STEREO.MEDIUM) {
            targetBitrate = TARGET_BITRATES.MONO_STEREO.MEDIUM;
        } else if (sourceBitrateKbps <= BITRATE_BOUNDARIES.MONO_STEREO.HIGH) {
            targetBitrate = TARGET_BITRATES.MONO_STEREO.HIGH;
        } else {
            targetBitrate = TARGET_BITRATES.MONO_STEREO.VERYHIGH;
        }
    } else {
        if (sourceBitrateKbps === 0) {
            targetBitrate = channels > 2 ? TARGET_BITRATES.MULTICHANNEL.HIGH : TARGET_BITRATES.MULTICHANNEL.LOW;
        } else if (sourceBitrateKbps <= BITRATE_BOUNDARIES.MULTICHANNEL.LOW) {
            targetBitrate = TARGET_BITRATES.MULTICHANNEL.LOW;
        } else if (sourceBitrateKbps <= BITRATE_BOUNDARIES.MULTICHANNEL.MEDIUM) {
            targetBitrate = TARGET_BITRATES.MULTICHANNEL.MEDIUM;
        } else if (sourceBitrateKbps <= BITRATE_BOUNDARIES.MULTICHANNEL.HIGH) {
            targetBitrate = TARGET_BITRATES.MULTICHANNEL.HIGH;
        } else if (sourceBitrateKbps <= BITRATE_BOUNDARIES.MULTICHANNEL.VERYHIGH) {
            targetBitrate = TARGET_BITRATES.MULTICHANNEL.VERYHIGH;
        } else {
            targetBitrate = TARGET_BITRATES.MULTICHANNEL.MAX;
        }
    }

    return targetBitrate;
};

// Helper function to calculate target channels based on input settings
const calculateTargetChannels = (inputChannels, inputs) => {
    if (inputChannels >= 8) { // 7.1 or higher
        if (InputValidator.parseBool(inputs.keep_71_as_71, false)) {
            return inputChannels > 8 ? 8 : inputChannels;
        } else {
            return 6; // DEFAULT BEHAVIOR: Downmix to 5.1
        }
    } else if (inputChannels === 6) { // 5.1
        return 6;
    } else if (inputChannels <= 2) { // Mono/Stereo
        return inputChannels;
    } else { // 3.x, 4.x, 5.x channel oddities
        return Math.min(inputChannels, 6);
    }
};

// Audio codec quality hierarchy
const getCodecQuality = (codecName, title = '') => {
    const codec = codecName.toLowerCase();
    const titleLower = title.toLowerCase();
    
    if (codec === 'truehd') {
        if (titleLower.includes('atmos')) return 100;
        return 95;
    }
    
    if (codec === 'dts') {
        if (titleLower.includes('dts-x')) return 90;
        if (titleLower.includes('dts-hd ma') || titleLower.includes('dts-hdma')) return 85;
        if (titleLower.includes('dts-hd hr') || titleLower.includes('dts-hdhr')) return 75;
        return 70;
    }
    
    if (codec === 'eac3') {
        if (titleLower.includes('atmos')) return 65;
        if (titleLower.includes('joc')) return 60;
        return 55;
    }
    
    if (codec === 'ac3') return 50;
    if (codec === 'aac') {
        if (titleLower.includes('he-aac')) return 40;
        return 45;
    }
    if (codec === 'flac') return 80;
    if (codec === 'alac') return 78;
    if (codec === 'vorbis') return 35;
    if (codec === 'mp3') return 30;
    if (codec === 'opus') return 200;
    
    if (codec.startsWith('pcm_')) return 110;
    
    return 0;
};

// Helper function to find duplicate audio tracks for removal
const findDuplicateAudioTracks = (streams, audioStreamsToRemove = []) => {
    const duplicatesToRemove = [];
    const languageChannelGroups = new Map();
    
    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        
        if (stream.codec_type.toLowerCase() !== 'audio' || audioStreamsToRemove.includes(i)) {
            continue;
        }
        
        const isCommentary = isCommentaryTrack(stream);
        if (isCommentary) {
            continue;
        }
        
        const language = stream.tags?.language?.toLowerCase() || 'und';
        const channels = stream.channels || 0;
        const groupKey = `${language}_${channels}`;
        
        if (!languageChannelGroups.has(groupKey)) {
            languageChannelGroups.set(groupKey, []);
        }
        
        languageChannelGroups.get(groupKey).push({
            streamIndex: i,
            stream: stream,
            quality: getCodecQuality(stream.codec_name, stream.tags?.title || ''),
            codec: stream.codec_name
        });
    }
    
    for (const [groupKey, tracks] of languageChannelGroups) {
        if (tracks.length > 1) {
            tracks.sort((a, b) => b.quality - a.quality);
            
            for (let i = 1; i < tracks.length; i++) {
                duplicatesToRemove.push({
                    streamIndex: tracks[i].streamIndex,
                    removedCodec: tracks[i].codec,
                    keptCodec: tracks[0].codec,
                    language: groupKey.split('_')[0],
                    channels: groupKey.split('_')[1]
                });
            }
        }
    }
    
    return duplicatesToRemove;
};

// Helper function to find lower channel tracks when higher channel exists for same language
const findLowerChannelDuplicates = (streams, audioStreamsToRemove = []) => {
    const lowerChannelToRemove = [];
    const languageChannelMap = new Map();
    
    // Group streams by language and track their channel counts
    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        
        if (stream.codec_type.toLowerCase() !== 'audio' || audioStreamsToRemove.includes(i)) {
            continue;
        }
        
        const isCommentary = isCommentaryTrack(stream);
        if (isCommentary) {
            continue;
        }
        
        const language = stream.tags?.language?.toLowerCase() || 'und';
        const channels = stream.channels || 0;
        
        if (!languageChannelMap.has(language)) {
            languageChannelMap.set(language, []);
        }
        
        languageChannelMap.get(language).push({
            streamIndex: i,
            stream: stream,
            channels: channels,
            codec: stream.codec_name,
            quality: getCodecQuality(stream.codec_name, stream.tags?.title || '')
        });
    }
    
    // For each language, find the highest channel count
    for (const [language, tracks] of languageChannelMap) {
        if (tracks.length <= 1) {
            continue; // Only one track, nothing to compare
        }
        
        // Sort by channels (descending), then by quality (descending)
        tracks.sort((a, b) => {
            if (b.channels !== a.channels) {
                return b.channels - a.channels; // Higher channels first
            }
            return b.quality - a.quality; // Higher quality first
        });
        
        const highestChannelCount = tracks[0].channels;
        
        // Mark all lower channel tracks for removal
        for (let i = 1; i < tracks.length; i++) {
            if (tracks[i].channels < highestChannelCount) {
                lowerChannelToRemove.push({
                    streamIndex: tracks[i].streamIndex,
                    channels: tracks[i].channels,
                    codec: tracks[i].codec,
                    language: language,
                    keptChannels: highestChannelCount,
                    keptCodec: tracks[0].codec
                });
            }
        }
    }
    
    return lowerChannelToRemove;
};

// IMPROVED: Enhanced IMDB redirect detection with proper error handling
const checkImdbRedirect = (imdbId, args, logger) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const axios = require('axios');
        const imdbUrl = `https://www.imdb.com/title/${imdbId}/`;
        
        logger.debug(`Checking for IMDB redirects: ${imdbUrl}`);
        
        const response = yield axios.get(imdbUrl, { 
            maxRedirects: 0,
            validateStatus: status => (status >= 200 && status < 400),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 30000
        });
        
        if ([301, 302, 307, 308].includes(response.status)) {
            const location = response.headers.location;
            if (location) {
                const match = location.match(/\/title\/(tt\d+)/);
                if (match && match[1] && match[1] !== imdbId) {
                    logger.success(`IMDB HTTP redirect detected: ${imdbId} → ${match[1]}`);
                    return match[1];
                }
            }
        }
        
        if (response.data && typeof response.data === 'string') {
            const html = response.data;
            
            const metaRefreshMatch = html.match(/<meta[^>]*http-equiv=["']refresh["'][^>]*content=["'][^"']*url=https:\/\/www\.imdb\.com\/title\/(tt\d+)/i);
            if (metaRefreshMatch && metaRefreshMatch[1] && metaRefreshMatch[1] !== imdbId) {
                logger.success(`IMDB meta refresh redirect detected: ${imdbId} → ${metaRefreshMatch[1]}`);
                return metaRefreshMatch[1];
            }
            
            const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/www\.imdb\.com\/title\/(tt\d+)/i);
            if (canonicalMatch && canonicalMatch[1] && canonicalMatch[1] !== imdbId) {
                logger.success(`IMDB canonical redirect detected: ${imdbId} → ${canonicalMatch[1]}`);
                return canonicalMatch[1];
            }
        }
        
        return null;
    } catch (error) {
        logger.warn(`Error checking IMDB redirect: ${error.message}`);
        return null;
    }
});

// IMPROVED: Enhanced TMDB API lookup with timeout and retry
const tryTmdbLookup = (id, args, logger, searchType = 'imdb_id') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const axios = require('axios');
        
        logger.debug(`TMDB API lookup: ${searchType} = ${id}`);
        
        const response = yield axios.get(
            `https://api.themoviedb.org/3/find/${id}?api_key=${args.inputs.tmdb_api_key}&language=en-US&external_source=${searchType}`,
            {
                timeout: 30000,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Tdarr-DeNiX-Plugin/1.0'
                }
            }
        );
        
        const data = response.data;
        
        if (data.movie_results && data.movie_results.length > 0) {
            logger.debug(`TMDB movie result found: ${data.movie_results[0].title || 'Unknown'}`);
            return data.movie_results[0];
        } else if (data.tv_results && data.tv_results.length > 0) {
            logger.debug(`TMDB TV result found: ${data.tv_results[0].name || 'Unknown'}`);
            return data.tv_results[0];
        }
        
        logger.debug(`No TMDB results found for ${searchType}: ${id}`);
        return null;
    } catch (error) {
        logger.debug(`TMDB API lookup failed: ${error.message}`);
        return null;
    }
});

// IMPROVED: Main TMDB lookup function with proper error handling
const tmdbLookup = (identifier, args, logger, searchType = 'imdb_id') => __awaiter(void 0, void 0, void 0, function* () {
    let id = identifier;
    
    if (searchType === 'imdb_id' && !id.startsWith('tt')) {
        const extracted = extractImdbId(id);
        if (extracted) {
            id = extracted;
        } else {
            logger.warn('No IMDB ID found in identifier');
            return null;
        }
    }

    logger.api(`Looking up ${searchType}: ${id}`);

    try {
        let result = yield AsyncHandler.withTimeout(
            AsyncHandler.withRetry(
                () => tryTmdbLookup(id, args, logger, searchType),
                2,
                2000,
                'TMDB lookup'
            ),
            30000,
            'TMDB API call'
        );
        
        if (!result && searchType === 'imdb_id') {
            const newImdbId = yield AsyncHandler.safeExecute(
                () => AsyncHandler.withTimeout(
                    checkImdbRedirect(id, args, logger),
                    15000,
                    'IMDB redirect check'
                ),
                null,
                logger
            );
            
            if (newImdbId) {
                logger.extended(`Retrying with redirected IMDB ID: ${newImdbId}`);
                result = yield AsyncHandler.safeExecute(
                    () => AsyncHandler.withTimeout(
                        tryTmdbLookup(newImdbId, args, logger, searchType),
                        15000,
                        'TMDB lookup retry'
                    ),
                    null,
                    logger
                );
            }
        }
        
        if (result) {
            const title = result.title || result.name || 'Unknown';
            const originalLang = result.original_language || 'unknown';
            logger.success(`TMDB match found: "${title}" (${originalLang})`);
        } else {
            logger.warn(`No TMDB result found for ${searchType}: ${id}`);
        }
        
        return result;
    } catch (error) {
        logger.error(`TMDB lookup failed: ${error.message}`);
        return null;
    }
});

// Enhanced ARR instance lookup
const lookupInArrInstance = (service, instance, fileName, args, logger) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = args.inputs[`${service}_api_key_${instance}`];
    const url = args.inputs[`${service}_url_${instance}`];
    
    if (!apiKey || !url) {
        logger.debug(`${service.charAt(0).toUpperCase() + service.slice(1)} ${instance} not configured`);
        return null;
    }

    try {
        const axios = require('axios');
        logger.api(`Querying ${service.charAt(0).toUpperCase() + service.slice(1)} ${instance}: ${url}`);
        
        let cleanUrl = url.trim().replace(/\/$/, '');
        
        if (!cleanUrl.match(/^https?:\/\//i)) {
            cleanUrl = `http://${cleanUrl}`;
        }
        
        const encodedFileName = encodeURIComponent(fileName);
        
        const response = yield axios.get(`${cleanUrl}/api/v3/parse?apikey=${apiKey}&title=${encodedFileName}`, {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Tdarr-DeNiX-Plugin/1.0'
            }
        });

        const data = response.data;
        
        if (service === 'radarr') {
            if (data.movie) {
                logger.success(`${service.charAt(0).toUpperCase() + service.slice(1)} ${instance}: Found movie match`);
                return {
                    imdbId: data.movie.imdbId,
                    title: data.movie.title,
                    originalLanguage: data.movie.originalLanguage?.name || 'en'
                };
            }
        } else if (service === 'sonarr') {
            if (data.series) {
                logger.success(`${service.charAt(0).toUpperCase() + service.slice(1)} ${instance}: Found series match`);
                return {
                    imdbId: data.series.imdbId,
                    tvdbId: data.series.tvdbId,
                    title: data.series.title,
                    originalLanguage: data.series.originalLanguage || 'en'
                };
            }
        }
        
        logger.debug(`${service.charAt(0).toUpperCase() + service.slice(1)} ${instance}: No match found`);
        return null;
    } catch (error) {
        logger.warn(`Error accessing ${service.charAt(0).toUpperCase() + service.slice(1)} ${instance}: ${error.message}`);
        return null;
    }
});

// Get metadata from ARR services
const getMetadataFromArr = (fileName, args, logger) => __awaiter(void 0, void 0, void 0, function* () {
    const services = InputValidator.parseBool(args.inputs.priority?.toLowerCase() === 'sonarr', false) ? 
        ['sonarr', 'radarr'] : ['radarr', 'sonarr'];
    
    for (const service of services) {
        logger.extended(`Checking ${service.charAt(0).toUpperCase() + service.slice(1)} instances...`);
        
        for (let instance = 1; instance <= 2; instance++) {
            const result = yield lookupInArrInstance(service, instance, fileName, args, logger);
            if (result) {
                if (result.imdbId) {
                    const tmdbResult = yield tmdbLookup(result.imdbId, args, logger);
                    if (tmdbResult) {
                        return tmdbResult;
                    }
                } else if (result.originalLanguage) {
                    return {
                        original_language: LanguageMapper.getAlpha3Code(result.originalLanguage),
                        title: result.title
                    };
                }
            }
        }
    }
    
    return null;
});

// Performance timer utility
const createPerformanceTimer = () => {
    const start = Date.now();
    const metrics = {};
    
    return {
        mark: (label) => {
            metrics[label] = Date.now() - start;
        },
        getMetrics: () => metrics,
        getTotalTime: () => Date.now() - start
    };
};

// Quality assurance checks
const performQualityAssurance = (inputs, fileName, logger) => {
    const result = {
        canProcess: true,
        errorMessage: '',
        warnings: []
    };

    try {
        if (InputValidator.parseBool(inputs.enable_language_filtering, true) && (!inputs.tmdb_api_key || inputs.tmdb_api_key.trim() === '')) {
            result.warnings.push('TMDB API key not provided - language detection will be disabled');
        }

        if (!fileName) {
            result.canProcess = false;
            result.errorMessage = 'No file name provided for processing';
            return result;
        }

        const hasRadarr = (inputs.radarr_api_key_1 && inputs.radarr_url_1) || (inputs.radarr_api_key_2 && inputs.radarr_url_2);
        const hasSonarr = (inputs.sonarr_api_key_1 && inputs.sonarr_url_1) || (inputs.sonarr_api_key_2 && inputs.sonarr_url_2);

        if (InputValidator.parseBool(inputs.enable_language_filtering, true) && !hasRadarr && !hasSonarr) {
            result.warnings.push('No *ARR services configured - will fallback to filename IMDB ID extraction');
        }

        if (inputs.user_langs) {
            const langs = InputValidator.parseLanguageList(inputs.user_langs, []);
            if (langs.length === 0) {
                result.warnings.push('Invalid or no valid language codes provided in user_langs');
            }
        }

        logger.debug(`Quality assurance completed: ${result.warnings.length} warnings`);
        result.warnings.forEach(warning => logger.warn(warning));

        return result;
    } catch (error) {
        result.canProcess = false;
        result.errorMessage = `Quality assurance failed: ${error.message}`;
        return result;
    }
};

// MAIN PLUGIN FUNCTION
const plugin = (args) => __awaiter(void 0, void 0, void 0, function* () {
    let logger;
    
    try {
        const lib = require('../../../../../methods/lib')();
        
        args.inputs = lib.loadDefaultValues(args.inputs, details);
        
        const enableAudioConversion = InputValidator.parseBool(args.inputs.enable_audio_conversion, true);
        const enableLanguageFiltering = InputValidator.parseBool(args.inputs.enable_language_filtering, true);
        
        logger = new Logger(args.inputs.logging_level);
        
        const performanceTimer = createPerformanceTimer();
        const processingMetrics = {
            languageDetectionTime: 0,
            streamAnalysisTime: 0,
            audioProcessingTime: 0,
            totalTime: 0
        };

        if (args.inputFileObj.fileMedium !== 'video') {
            logger.warn('Not a video file. Skipping.');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        logger.section('DeNiX Audio Processing: Language Detection + Opus Conversion 3.0');
        logger.info(`File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`Container: ${args.inputFileObj.container} | Streams: ${args.inputFileObj.ffProbeData.streams.length}`);
        logger.info(`Audio conversion: ${enableAudioConversion ? 'ENABLED' : 'DISABLED'}`);

        const ffmpegPath = getFFmpegPath(args.inputs, logger);
        logger.debug(`FFmpeg path: ${ffmpegPath}`);

        const fileName = path.basename(args.inputFileObj._id);
        const qaResult = performQualityAssurance(args.inputs, fileName, logger);
        if (!qaResult.canProcess) {
            logger.error(qaResult.errorMessage);
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

        let detectedLanguages = ['eng', 'und'];
        let needsProcessing = false;

        // STEP 1: LANGUAGE DETECTION
        if (enableLanguageFiltering && args.inputs.tmdb_api_key) {
            logger.subsection('Step 1: Detecting native language from TMDB/IMDB');
            const languageStartTime = Date.now();
            
            try {
                let tmdbResult = null;
                
                logger.debug(`Processing file: ${fileName}`);
                logger.debug(`Service priority: ${args.inputs.priority.toLowerCase() === 'sonarr' ? 'sonarr → radarr' : 'radarr → sonarr'}`);

                tmdbResult = yield getMetadataFromArr(fileName, args, logger);

                if (!tmdbResult) {
                    logger.extended('Falling back to filename IMDB ID extraction...');
                    const imdbId = extractImdbId(fileName);
                    if (imdbId) {
                        logger.success(`Got IMDB ID (${imdbId}) from filename`);
                        tmdbResult = yield tmdbLookup(imdbId, args, logger);
                    } else {
                        logger.warn('No IMDB ID found in filename');
                    }
                }

                if (tmdbResult && tmdbResult.original_language) {
                    const alpha2Code = tmdbResult.original_language.toLowerCase().trim();
                    const nativeLang = LanguageMapper.getAlpha3Code(alpha2Code);
                    
                    detectedLanguages = [nativeLang];
                    
                    if (args.inputs.user_langs) {
                        const userLangList = InputValidator.parseLanguageList(args.inputs.user_langs, []);
                        userLangList.forEach(lang => {
                            if (!detectedLanguages.includes(lang)) {
                                detectedLanguages.push(lang);
                            }
                        });
                    }
                    
                    ['eng', 'und'].forEach(lang => {
                        if (!detectedLanguages.includes(lang)) {
                            detectedLanguages.push(lang);
                        }
                    });
                    
                    logger.success(`Native language detected: ${nativeLang}`);
                    logger.success(`Languages to keep: ${detectedLanguages.join(', ')}`);
                } else {
                    logger.warn('Could not determine native language - using defaults + user languages');
                    if (args.inputs.user_langs) {
                        const userLangList = InputValidator.parseLanguageList(args.inputs.user_langs, []);
                        detectedLanguages = [...new Set(['eng', 'und', ...userLangList])];
                    }
                }
                
                processingMetrics.languageDetectionTime = Date.now() - languageStartTime;
                performanceTimer.mark('languageDetection');
                
            } catch (languageError) {
                logger.error(`Language detection failed: ${languageError.message}`);
                logger.warn('Falling back to user languages + defaults');
                if (args.inputs.user_langs) {
                    const userLangList = InputValidator.parseLanguageList(args.inputs.user_langs, []);
                    detectedLanguages = [...new Set(['eng', 'und', ...userLangList])];
                }
                processingMetrics.languageDetectionTime = Date.now() - languageStartTime;
            }
        } else {
            logger.subsection('Step 1: Language detection disabled');
            if (args.inputs.user_langs) {
                const userLangList = InputValidator.parseLanguageList(args.inputs.user_langs, []);
                detectedLanguages = [...new Set(['eng', 'und', ...userLangList])];
            }
        }

        // STEP 2: STREAM ANALYSIS AND PLANNING
        logger.subsection('Step 2: Analyzing audio streams for processing');
        const analysisStartTime = Date.now();
        
        const audioStreams = args.inputFileObj.ffProbeData.streams.filter(s => s.codec_type === 'audio');
        
        logger.extended(`Current stream layout:`);
        args.inputFileObj.ffProbeData.streams.forEach((stream, index) => {
            if (stream.codec_type === 'video') {
                logger.extended(`${index}: Video - ${stream.codec_name} ${stream.width}x${stream.height}`);
            } else if (stream.codec_type === 'audio') {
                const lang = stream.tags?.language || 'und';
                const title = stream.tags?.title || '';
                const commentary = isCommentaryTrack(stream) ? ' [COMMENTARY]' : '';
                logger.extended(`${index}: Audio - ${stream.codec_name} ${stream.channels}ch ${lang}${commentary}${title ? ` "${title}"` : ''}`);
            } else if (stream.codec_type === 'subtitle') {
                const lang = stream.tags?.language || 'und';
                const title = stream.tags?.title || '';
                logger.extended(`${index}: Subtitle - ${stream.codec_name} ${lang}${title ? ` "${title}"` : ''}`);
            }
        });
        
        const codecsToConvert = ['aac', 'ac3', 'eac3', 'dts', 'mp3', 'flac', 'vorbis', 'wav', 'alac', 'pcm_s16le', 'pcm_s24le', 'pcm_u8', 'truehd'];
        
        let audioStreamsToRemove = [];
        let audioConversionNeeded = false;

        // First pass: Identify streams to remove based on language filtering
        if (enableLanguageFiltering) {
            for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
                const stream = args.inputFileObj.ffProbeData.streams[i];
                
                if (stream.codec_type === 'audio') {
                    const language = stream.tags?.language?.toLowerCase() || 'und';
                    const isCommentary = isCommentaryTrack(stream);
                    
                    // Remove commentary if configured
                    if (InputValidator.parseBool(args.inputs.remove_commentary_audio, false) && isCommentary) {
                        audioStreamsToRemove.push(i);
                        logger.info(`Audio ${i}: Commentary track marked for removal`);
                        continue;
                    }
                    
                    // Remove if language not in keep list
                    if (!detectedLanguages.includes(language)) {
                        audioStreamsToRemove.push(i);
                        logger.info(`Audio ${i}: Language "${language}" not in keep list - marked for removal`);
                        continue;
                    }
                }
            }
        }

        // Check for duplicate removal
        if (InputValidator.parseBool(args.inputs.remove_lower_quality_duplicates, true)) {
            logger.extended('Analyzing for duplicate audio tracks...');
            
            const duplicatesToRemove = findDuplicateAudioTracks(args.inputFileObj.ffProbeData.streams, audioStreamsToRemove);
            
            if (duplicatesToRemove.length > 0) {
                duplicatesToRemove.forEach(duplicate => {
                    audioStreamsToRemove.push(duplicate.streamIndex);
                    logger.extended(`Remove duplicate: Stream ${duplicate.streamIndex} (${duplicate.removedCodec}, keeping ${duplicate.keptCodec})`);
                });
            } else {
                logger.success('No duplicate audio tracks found');
            }
        }

        // NEW: Check for lower channel duplicates when higher channel exists
        logger.extended('Analyzing for lower channel duplicates...');
        const lowerChannelDuplicates = findLowerChannelDuplicates(args.inputFileObj.ffProbeData.streams, audioStreamsToRemove);
        
        if (lowerChannelDuplicates.length > 0) {
            lowerChannelDuplicates.forEach(duplicate => {
                audioStreamsToRemove.push(duplicate.streamIndex);
                logger.extended(`Remove lower channel: Stream ${duplicate.streamIndex} (${duplicate.channels}ch ${duplicate.codec} for ${duplicate.language}, keeping ${duplicate.keptChannels}ch ${duplicate.keptCodec})`);
            });
            logger.success(`Removed ${lowerChannelDuplicates.length} lower channel duplicate(s)`);
        } else {
            logger.success('No lower channel duplicates found');
        }

        // Second pass: Check if conversion is needed for REMAINING streams
        for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
            const stream = args.inputFileObj.ffProbeData.streams[i];
            
            if (stream.codec_type === 'audio' && !audioStreamsToRemove.includes(i)) {
                const isCommentary = isCommentaryTrack(stream);
                
                // Skip commentary analysis if configured
                if (InputValidator.parseBool(args.inputs.ignore_commentary, false) && isCommentary) {
                    logger.info(`Audio ${i}: Commentary track - will keep as-is`);
                    continue;
                }
                
                if (enableAudioConversion && 
                    codecsToConvert.includes(stream.codec_name) && 
                    stream.codec_name !== 'opus') {
                    audioConversionNeeded = true;
                    logger.info(`Audio ${i}: ${stream.codec_name} → Opus conversion needed`);
                } else if (stream.codec_name === 'opus') {
                    logger.success(`Audio ${i}: Already Opus, keeping as-is`);
                } else if (!enableAudioConversion) {
                    logger.info(`Audio ${i}: Conversion disabled, keeping ${stream.codec_name} as-is`);
                } else {
                    logger.success(`Audio ${i}: ${stream.codec_name} not in conversion list, keeping as-is`);
                }
            }
        }

        processingMetrics.streamAnalysisTime = Date.now() - analysisStartTime;
        performanceTimer.mark('streamAnalysis');

        needsProcessing = audioStreamsToRemove.length > 0 || audioConversionNeeded;

        logger.subsection('Processing Summary');
        logger.info(`Audio streams to remove: ${audioStreamsToRemove.length}`);
        logger.info(`Audio conversion needed: ${audioConversionNeeded ? 'Yes' : 'No'}`);
        logger.success(`Overall processing needed: ${needsProcessing ? 'Yes' : 'No'}`);

        if (!needsProcessing) {
            logger.success('No processing required - file is already optimal for audio');
            logger.info('Ready for next stage processing (Stream Ordering)');
            
            processingMetrics.totalTime = performanceTimer.getTotalTime();
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        // STEP 3: BUILD FFMPEG COMMAND WITH PROPER MULTI-TRACK SUPPORT
        logger.subsection('Step 3: Building FFmpeg conversion command with multi-track support');
        const audioStartTime = Date.now();
        
        const workDir = (0, fileUtils_1.getPluginWorkDir)(args);
        if (!fs.existsSync(workDir)) {
            fs.mkdirSync(workDir, { recursive: true });
        }
        
        const outputFilePath = path.join(workDir, `${path.parse(args.inputFileObj._id).name}.${args.inputFileObj.container}`);
        
        const ffmpegArgs = ['-i', args.inputFileObj._id];
        
        // Map video streams
        ffmpegArgs.push('-map', '0:v');
        ffmpegArgs.push('-c:v', 'copy');
        
        // Build language-based track plan
        const languageTrackPlan = new Map();
        
        // First, analyze what tracks exist per language
        for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
            const stream = args.inputFileObj.ffProbeData.streams[i];
            
            if (stream.codec_type !== 'audio' || audioStreamsToRemove.includes(i)) {
                continue;
            }
            
            const language = stream.tags?.language?.toLowerCase() || 'und';
            const channels = stream.channels || 2;
            const codec = stream.codec_name;
            const isCommentary = isCommentaryTrack(stream);
            
            if (!languageTrackPlan.has(language)) {
                languageTrackPlan.set(language, {
                    streams: [],
                    hasStereo: false,
                    has51: false,
                    has71Plus: false,
                    highestChannelStream: null,
                    highestChannelCount: 0
                });
            }
            
            const langData = languageTrackPlan.get(language);
            langData.streams.push({
                streamIndex: i,
                stream: stream,
                channels: channels,
                codec: codec,
                isCommentary: isCommentary
            });
            
            // Track what exists
            if (channels <= 2) {
                langData.hasStereo = true;
            } else if (channels === 6) {
                langData.has51 = true;
            } else if (channels >= 8) {
                langData.has71Plus = true;
            }
            
            // Track highest channel stream
            if (channels > langData.highestChannelCount) {
                langData.highestChannelCount = channels;
                langData.highestChannelStream = {
                    streamIndex: i,
                    stream: stream,
                    channels: channels,
                    codec: codec,
                    isCommentary: isCommentary
                };
            }
        }
        
        logger.extended(`Language track planning completed for ${languageTrackPlan.size} languages`);
        
        // Track audio output index
        let audioOutputIndex = 0;
        
        // Process each language group
        for (const [language, langData] of languageTrackPlan) {
            logger.extended(`Processing language: ${language}`);
            
            const keep71As71 = InputValidator.parseBool(args.inputs.keep_71_as_71, false);
            const create51From71 = InputValidator.parseBool(args.inputs.create_51_from_71, false);
            const create20IfMissing = InputValidator.parseBool(args.inputs.create_20_if_missing, false);
            
            // Determine what tracks to create for this language
            const tracksToCreate = [];
            
            // Process each existing stream for this language
            for (const streamData of langData.streams) {
                const stream = streamData.stream;
                const channels = streamData.channels;
                const codec = streamData.codec;
                const streamIndex = streamData.streamIndex;
                const isCommentary = streamData.isCommentary;
                
                // Calculate source bitrate
                let sourceBitrate = 0;
                if (stream.bit_rate) {
                    sourceBitrate = parseInt(stream.bit_rate, 10);
                } else if (stream.tags?.BPS) {
                    sourceBitrate = parseInt(stream.tags.BPS, 10);
                }
                const sourceBitrateKbps = sourceBitrate > 0 ? Math.round(sourceBitrate / 1000) : 0;
                
                const needsConversion = enableAudioConversion && 
                                       codecsToConvert.includes(codec) && 
                                       codec !== 'opus' &&
                                       (!isCommentary || !InputValidator.parseBool(args.inputs.ignore_commentary, false));
                
                if (!needsConversion) {
                    // Just copy this stream
                    tracksToCreate.push({
                        streamIndex: streamIndex,
                        action: 'copy',
                        channels: channels,
                        language: language,
                        title: stream.tags?.title || '',
                        description: `Copy ${codec} ${channels}ch`
                    });
                    continue;
                }
                
                // This stream needs conversion - determine what tracks to create from it
                if (channels >= 8) {
                    // 7.1+ source
                    if (keep71As71) {
                        // Keep as 7.1
                        const bitrate71 = calculateTargetBitrate(8, sourceBitrateKbps, args.inputs);
                        tracksToCreate.push({
                            streamIndex: streamIndex,
                            action: 'convert',
                            sourceChannels: channels,
                            targetChannels: 8,
                            bitrate: bitrate71,
                            language: language,
                            title: stream.tags?.title || '',
                            description: `Convert to 7.1 Opus @ ${bitrate71}`,
                            useDownmixFilter: false
                        });
                        
                        // Additionally create 5.1 if requested
                        if (create51From71) {
                            const bitrate51 = calculateTargetBitrate(6, sourceBitrateKbps, args.inputs);
                            tracksToCreate.push({
                                streamIndex: streamIndex,
                                action: 'convert',
                                sourceChannels: channels,
                                targetChannels: 6,
                                bitrate: bitrate51,
                                language: language,
                                title: stream.tags?.title ? `${stream.tags.title} (5.1)` : '5.1',
                                description: `Create 5.1 Opus from 7.1+ @ ${bitrate51}`,
                                useDownmixFilter: true,
                                downmixType: '5.1'
                            });
                        }
                    } else {
                        // Default: Downmix to 5.1
                        const bitrate51 = calculateTargetBitrate(6, sourceBitrateKbps, args.inputs);
                        tracksToCreate.push({
                            streamIndex: streamIndex,
                            action: 'convert',
                            sourceChannels: channels,
                            targetChannels: 6,
                            bitrate: bitrate51,
                            language: language,
                            title: stream.tags?.title || '',
                            description: `Downmix to 5.1 Opus @ ${bitrate51}`,
                            useDownmixFilter: true,
                            downmixType: '5.1'
                        });
                    }
                } else if (channels === 6) {
                    // 5.1 source - just convert to Opus 5.1
                    const bitrate51 = calculateTargetBitrate(6, sourceBitrateKbps, args.inputs);
                    tracksToCreate.push({
                        streamIndex: streamIndex,
                        action: 'convert',
                        sourceChannels: channels,
                        targetChannels: 6,
                        bitrate: bitrate51,
                        language: language,
                        title: stream.tags?.title || '',
                        description: `Convert to 5.1 Opus @ ${bitrate51}`,
                        useDownmixFilter: false
                    });
                } else if (channels <= 2) {
                    // Stereo/Mono - convert
                    const targetChannels = Math.min(channels, 2);
                    const bitrate = calculateTargetBitrate(targetChannels, sourceBitrateKbps, args.inputs);
                    tracksToCreate.push({
                        streamIndex: streamIndex,
                        action: 'convert',
                        sourceChannels: channels,
                        targetChannels: targetChannels,
                        bitrate: bitrate,
                        language: language,
                        title: stream.tags?.title || '',
                        description: `Convert to ${targetChannels}ch Opus @ ${bitrate}`,
                        useDownmixFilter: false
                    });
                } else {
                    // Oddball channels (3, 4, 5) - convert to stereo
                    const bitrate = calculateTargetBitrate(2, sourceBitrateKbps, args.inputs);
                    tracksToCreate.push({
                        streamIndex: streamIndex,
                        action: 'convert',
                        sourceChannels: channels,
                        targetChannels: 2,
                        bitrate: bitrate,
                        language: language,
                        title: stream.tags?.title || '',
                        description: `Downmix to stereo Opus @ ${bitrate}`,
                        useDownmixFilter: true,
                        downmixType: 'stereo'
                    });
                }
            }
            
            // After processing existing streams, check if we need to create stereo
            if (create20IfMissing && !langData.hasStereo && langData.highestChannelStream) {
                const highestStream = langData.highestChannelStream;
                
                // Only create if the highest channel stream is multi-channel
                if (highestStream.channels > 2) {
                    // Calculate source bitrate
                    let sourceBitrate = 0;
                    if (highestStream.stream.bit_rate) {
                        sourceBitrate = parseInt(highestStream.stream.bit_rate, 10);
                    } else if (highestStream.stream.tags?.BPS) {
                        sourceBitrate = parseInt(highestStream.stream.tags.BPS, 10);
                    }
                    const sourceBitrateKbps = sourceBitrate > 0 ? Math.round(sourceBitrate / 1000) : 0;
                    
                    const bitrateStereo = calculateTargetBitrate(2, sourceBitrateKbps, args.inputs);
                    
                    tracksToCreate.push({
                        streamIndex: highestStream.streamIndex,
                        action: 'convert',
                        sourceChannels: highestStream.channels,
                        targetChannels: 2,
                        bitrate: bitrateStereo,
                        language: language,
                        title: highestStream.stream.tags?.title ? `${highestStream.stream.tags.title} (Stereo)` : 'Stereo',
                        description: `Create stereo Opus from ${highestStream.channels}ch @ ${bitrateStereo}`,
                        useDownmixFilter: true,
                        downmixType: 'stereo'
                    });
                    
                    logger.extended(`Creating stereo track for ${language} from ${highestStream.channels}ch source`);
                }
            }
            
            // Now build FFmpeg arguments for all tracks to create
            for (const track of tracksToCreate) {
                ffmpegArgs.push('-map', `0:${track.streamIndex}`);
                
                if (track.action === 'copy') {
                    ffmpegArgs.push(`-c:a:${audioOutputIndex}`, 'copy');
                    logger.extended(`Track ${audioOutputIndex}: ${track.description}`);
                } else {
                    // Convert to Opus
                    ffmpegArgs.push(`-c:a:${audioOutputIndex}`, 'libopus');
                    ffmpegArgs.push(`-b:a:${audioOutputIndex}`, track.bitrate);
                    
                    if (track.targetChannels === 6) {
                        ffmpegArgs.push(`-ac:a:${audioOutputIndex}`, '6');
                        ffmpegArgs.push(`-mapping_family:a:${audioOutputIndex}`, '1');
                        
                        if (track.useDownmixFilter && track.downmixType === '5.1') {
                            // Downmix filter for 5.1 from 7.1+
                            ffmpegArgs.push(`-af:a:${audioOutputIndex}`, 'pan=5.1|FL=FL|FR=FR|FC=FC|LFE=LFE|BL=BL|BR=BR');
                        }
                    } else if (track.targetChannels === 8) {
                        ffmpegArgs.push(`-ac:a:${audioOutputIndex}`, '8');
                        ffmpegArgs.push(`-mapping_family:a:${audioOutputIndex}`, '1');
                    } else if (track.targetChannels === 2) {
                        ffmpegArgs.push(`-ac:a:${audioOutputIndex}`, '2');
                        ffmpegArgs.push(`-mapping_family:a:${audioOutputIndex}`, '0');
                        
                        if (track.useDownmixFilter && track.downmixType === 'stereo') {
                            // Stereo downmix filter
                            const stereoFilter = createStereoDownmixFilter(track.sourceChannels);
                            ffmpegArgs.push(`-af:a:${audioOutputIndex}`, stereoFilter);
                        }
                    } else if (track.targetChannels === 1) {
                        ffmpegArgs.push(`-ac:a:${audioOutputIndex}`, '1');
                        ffmpegArgs.push(`-mapping_family:a:${audioOutputIndex}`, '0');
                    } else {
                        // Other channel counts
                        ffmpegArgs.push(`-ac:a:${audioOutputIndex}`, track.targetChannels.toString());
                        ffmpegArgs.push(`-mapping_family:a:${audioOutputIndex}`, track.targetChannels > 2 ? '1' : '0');
                    }
                    
                    logger.extended(`Track ${audioOutputIndex}: ${track.description}`);
                }
                
                // Copy metadata
                if (track.language && track.language !== 'none') {
                    ffmpegArgs.push(`-metadata:s:a:${audioOutputIndex}`, `language=${track.language}`);
                }
                if (track.title) {
                    ffmpegArgs.push(`-metadata:s:a:${audioOutputIndex}`, `title=${track.title}`);
                }
                
                audioOutputIndex++;
            }
        }
        
        // Map subtitles, data, and attachments
        ffmpegArgs.push('-map', '0:s?');
        ffmpegArgs.push('-c:s', 'copy');
        ffmpegArgs.push('-map', '0:d?');
        ffmpegArgs.push('-map', '0:t?');
        
        // Add max muxing queue size
        ffmpegArgs.push('-max_muxing_queue_size', '9999');
        
        // Add output file
        ffmpegArgs.push('-y', outputFilePath);
        
        logger.success('FFmpeg command built successfully with multi-track support');
        logger.extended(`Output path: ${outputFilePath}`);
        logger.extended(`Total audio tracks in output: ${audioOutputIndex}`);
        logger.extended(`Audio streams removed: ${audioStreamsToRemove.length}`);
        
        if (args.inputs.logging_level === 'debug') {
            logger.debug(`Full FFmpeg command: ${ffmpegPath} ${ffmpegArgs.join(' ')}`);
        }
        
        // Execute FFmpeg
        logger.success('Executing FFmpeg processing...');
        
        try {
            const cli = new cliUtils_1.CLI({
                cli: ffmpegPath,
                spawnArgs: ffmpegArgs,
                spawnOpts: {},
                jobLog: args.jobLog,
                outputFilePath: outputFilePath,
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
            
            processingMetrics.audioProcessingTime = Date.now() - audioStartTime;
            processingMetrics.totalTime = performanceTimer.getTotalTime();
            
            logger.success('FFmpeg processing completed successfully');
            logger.success('Audio processing complete!');
            logger.info('Ready for Stream Ordering plugin');
            logger.info('=== End of Audio Processing ===');
            
            // Performance metrics
            if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
                logger.subsection('Performance Metrics');
                logger.extended(`⏱️ Language detection: ${processingMetrics.languageDetectionTime}ms`);
                logger.extended(`⏱️ Stream analysis: ${processingMetrics.streamAnalysisTime}ms`);
                logger.extended(`⏱️ Audio processing: ${processingMetrics.audioProcessingTime}ms`);
                logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
            }
            
            args.jobLog(logger.getOutput());
            
            const enhancedVariables = Object.assign(Object.assign({}, args.variables), {
                denix_audio_completed: true,
                denix_audio_processing_time: processingMetrics.totalTime,
                denix_audio_languages_detected: detectedLanguages.join(','),
                denix_audio_streams_removed: audioStreamsToRemove.length,
                denix_audio_conversion_performed: audioConversionNeeded && enableAudioConversion,
                denix_audio_tracks_created: audioOutputIndex,
                denix_audio_ffmpeg_path: ffmpegPath,
                denix_audio_os_detected: detectOperatingSystem(),
                denix_audio_timestamp: new Date().toISOString(),
                denix_audio_plugin_version: '2.0.0',
                denix_audio_language_detection_time: processingMetrics.languageDetectionTime,
                denix_audio_stream_analysis_time: processingMetrics.streamAnalysisTime,
                denix_audio_audio_processing_time: processingMetrics.audioProcessingTime,
                denix_audio_duplicate_tracks_removed: InputValidator.parseBool(args.inputs.remove_lower_quality_duplicates, true) ? findDuplicateAudioTracks(args.inputFileObj.ffProbeData.streams, audioStreamsToRemove).length : 0,
                denix_audio_streams_processed: args.inputFileObj.ffProbeData.streams.length,
                denix_audio_output_streams: audioOutputIndex
            });
            
            return {
                outputFileObj: {
                    _id: outputFilePath,
                },
                outputNumber: 1,
                variables: enhancedVariables,
            };
            
        } catch (ffmpegError) {
            logger.error(`FFmpeg execution failed: ${ffmpegError.message}`);
            logger.error('Audio processing failed - routing to error output');
            
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

    } catch (error) {
        if (!logger) {
            logger = new Logger('info');
        }
        logger.error(`Plugin execution failed: ${error.message}`);
        if (error.stack) {
            logger.debug(`Stack trace: ${error.stack}`);
        }
        logger.error('Critical error occurred - plugin execution failed');
        args.jobLog(logger.getOutput());
        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 3,
            variables: args.variables,
        };
    }
});

exports.plugin = plugin;