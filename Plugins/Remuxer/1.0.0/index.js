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

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details
const details = () => ({
    name: '🔧 DeNiX Enhanced MKV Pre-Process: Advanced Cleanup, Remux & Subtitle Language Filtering',
    description: 'Comprehensive MKV-focused pre-processing plugin that reorders streams, removes data/attachment streams, handles unwanted image formats (MJPEG, PNG, GIF), manages chapter removal, and performs smart remuxing with intelligent subtitle conversion to embedded SRT with smart language filtering. Features enhanced MediaInfo integration for RTP hint track detection and environment-aware processing. Only supports MKV output for maximum compatibility.',
    style: {
        borderColor: '#8B4513',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        // Enhanced bright saddle brown glow with 10 layers - expanded reach with graduated opacity
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
    tags: 'pre-processing,ffmpeg,cleanup,remux,reorder,mediainfo,mkv-only,subtitle-filtering',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🔧',
    inputs: [
		{
			label: '🔍 MediaInfo Path (Linux/Mac)',
			name: 'mediainfo_path_linux',
			type: 'string',
			defaultValue: 'mediainfo',
			inputUI: { type: 'text' },
			tooltip: 'MediaInfo executable path for Linux/Mac (Non-Docker only). Docker uses built-in mediainfo.js. Set to "disabled" for ffprobe-only mode. Examples: "mediainfo", "/usr/bin/mediainfo"',
		},
		{
			label: '🔍 MediaInfo Path (Windows)',
			name: 'mediainfo_path_windows',
			type: 'string',
			defaultValue: 'mediainfo.exe',
			inputUI: { type: 'text' },
			tooltip: 'MediaInfo executable path for Windows (Non-Docker only). Docker uses built-in mediainfo.js. Set to "disabled" for ffprobe-only mode. Examples: "mediainfo.exe", "C:\\Program Files\\MediaInfo\\MediaInfoCLI.exe"',
		},
		{
			label: '🌐 Preferred Subtitle Languages',
			name: 'preferred_subtitle_languages',
			type: 'string',
			defaultValue: '',
			inputUI: { type: 'text' },
			tooltip: 'Comma-separated list of preferred subtitle languages to keep during conversion. Uses ISO 639-1 (2-letter) or ISO 639-2 (3-letter) language codes. Examples: "en,es,fr" or "eng,spa,fre". Only applies when subtitle conversion to embedded SRT is needed for MKV compatibility. Undefined/unknown language subtitles are ALWAYS kept. Leave empty to keep all languages during conversion.',
		},
		{
			label: '🗑️ Remove Data Streams',
			name: 'remove_data_streams',
			type: 'boolean',
			defaultValue: true,
			inputUI: { type: 'switch' },
			tooltip: 'Remove data streams including RTP hint tracks. Enhanced detection with MediaInfo integration.',
		},
		{
			label: '🖼️ Remove Image Streams',
			name: 'remove_image_streams',
			type: 'boolean',
			defaultValue: true,
			inputUI: { type: 'switch' },
			tooltip: 'Remove unwanted image format streams (MJPEG, PNG, GIF) like embedded cover art or thumbnails.',
		},
		{
			label: '📖 Remove Chapters',
			name: 'remove_chapters',
			type: 'boolean',
			defaultValue: false,
			inputUI: { type: 'switch' },
			tooltip: 'Remove chapter information from the file. Useful for corrupted or unwanted chapters.',
		},
		{
			label: '🔎 Remove Attachments',
			name: 'remove_attachments',
			type: 'boolean',
			defaultValue: false,
			inputUI: { type: 'switch' },
			tooltip: 'Remove attachment streams (fonts, cover art, etc.) to reduce file size.',
		},
		{
			label: '🔄 Reorder Streams',
			name: 'reorder_streams',
			type: 'boolean',
			defaultValue: true,
			inputUI: { type: 'switch' },
			tooltip: 'Reorder streams to optimal layout: Video → Audio → Subtitles → Data → Attachments',
		},
		{
			label: '🛡️ Enable QA Checks',
			name: 'enable_qa_checks',
			type: 'boolean',
			defaultValue: true,
			inputUI: { type: 'switch' },
			tooltip: 'Enable quality assurance checks and validation with detailed stream analysis.',
		},
		{
			label: '⏰ Fix Timestamps',
			name: 'fix_timestamps',
			type: 'boolean',
			defaultValue: true,
			inputUI: { type: 'switch' },
			tooltip: 'Automatically fix timestamp issues for problematic containers (TS, AVI, MPG, MPEG).',
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
			tooltip: 'Logging detail level: info (basic), extended (detailed analysis), debug (full diagnostics)',
		},
		{
			label: '🛠️ FFmpeg Path (Linux/Mac)',
			name: 'ffmpeg_path_linux',
			type: 'string',
			defaultValue: 'ffmpeg',
			inputUI: { type: 'text' },
			tooltip: 'Path to FFmpeg binary for Linux/Mac. Examples: "ffmpeg", "/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg"',
		},
		{
			label: '🛠️ FFmpeg Path (Windows)',
			name: 'ffmpeg_path_windows',
			type: 'string',
			defaultValue: 'ffmpeg.exe',
			inputUI: { type: 'text' },
			tooltip: 'Path to FFmpeg binary for Windows. Examples: "ffmpeg.exe", "C:\\ffmpeg\\bin\\ffmpeg.exe"',
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
// LANGUAGE CODE VALIDATION AND PARSING
// ===============================================

// Parse preferred languages from input string
const parsePreferredLanguages = (languageString) => {
    if (!languageString || languageString.trim() === '') {
        return [];
    }
    
    return languageString
        .split(',')
        .map(lang => lang.trim().toLowerCase())
        .filter(lang => lang.length > 0);
};

// Validate language code format (ISO 639-1 or ISO 639-2)
const isValidLanguageCode = (code) => {
    const twoLetterPattern = /^[a-z]{2}$/;
    const threeLetterPattern = /^[a-z]{3}$/;
    return twoLetterPattern.test(code) || threeLetterPattern.test(code);
};

// Check if language should be kept during conversion
const shouldKeepLanguageDuringConversion = (streamLanguage, preferredLanguages) => {
    // Always keep undefined/unknown languages
    if (!streamLanguage || streamLanguage === 'undefined' || streamLanguage === 'und') {
        return true;
    }
    
    // If no preferred languages specified, keep all
    if (!preferredLanguages || preferredLanguages.length === 0) {
        return true;
    }
    
    // Check if language is in preferred list
    const normalizedStreamLang = streamLanguage.toLowerCase();
    return preferredLanguages.some(prefLang => 
        normalizedStreamLang === prefLang || 
        normalizedStreamLang.startsWith(prefLang) || 
        prefLang.startsWith(normalizedStreamLang)
    );
};

// ===============================================
// PLATFORM DETECTION AND PATH SELECTION
// ===============================================

// Detect current platform and return appropriate path
const getPlatformSpecificPath = (linuxPath, windowsPath) => {
    const platform = process.platform;
    
    // Windows platforms
    if (platform === 'win32') {
        return windowsPath;
    }
    
    // Unix-like platforms (Linux, macOS, etc.)
    return linuxPath;
};

// ===============================================
// MEDIAINFO INTEGRATION AND ENVIRONMENT DETECTION
// ===============================================

// Global cache for environment detection and MediaInfo availability
let isDockerEnvironment = null;
let mediaInfoJsAvailable = null;
let MediaInfoLib = null;

// Function to detect Docker environment
const detectDockerEnvironment = () => {
    if (isDockerEnvironment !== null) {
        return isDockerEnvironment;
    }
    
    try {
        const fs = require('fs');
        
        // Method 1: Check for .dockerenv file
        if (fs.existsSync('/.dockerenv')) {
            isDockerEnvironment = true;
            return true;
        }
        
        // Method 2: Check cgroup for docker indicators
        if (fs.existsSync('/proc/1/cgroup')) {
            const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
            if (cgroup.includes('docker') || cgroup.includes('containerd')) {
                isDockerEnvironment = true;
                return true;
            }
        }
        
        // Method 3: Check for Tdarr-specific Docker paths
        if (fs.existsSync('/app/Tdarr_Node') || fs.existsSync('/home/Tdarr')) {
            isDockerEnvironment = true;
            return true;
        }
        
        // Method 4: Check environment variables
        const containerEnvVars = ['HOSTNAME', 'container', 'DOCKER_CONTAINER'];
        for (const envVar of containerEnvVars) {
            const value = process.env[envVar];
            if (value && (value.includes('docker') || value.includes('container'))) {
                isDockerEnvironment = true;
                return true;
            }
        }
        
        // If none of the above, assume bare metal
        isDockerEnvironment = false;
        return false;
        
    } catch (err) {
        // If error detecting, assume bare metal for safety
        isDockerEnvironment = false;
        return false;
    }
};

// Function to initialize MediaInfo.js (Docker only)
const initializeMediaInfoJS = () => {
    if (!detectDockerEnvironment()) {
        return false; // Don't use mediainfo.js on bare metal
    }
    
    if (mediaInfoJsAvailable !== null) {
        return mediaInfoJsAvailable;
    }
    
    try {
        // Try multiple paths for mediainfo.js
        const paths = [
            '/app/Tdarr_Node/node_modules/mediainfo.js',
            './Tdarr_Node/node_modules/mediainfo.js',
            'mediainfo.js'
        ];
        
        for (const path of paths) {
            try {
                MediaInfoLib = require(path);
                mediaInfoJsAvailable = true;
                return true;
            } catch (err) {
                continue;
            }
        }
        
        mediaInfoJsAvailable = false;
        return false;
    } catch (err) {
        mediaInfoJsAvailable = false;
        return false;
    }
};

// Function to get MediaInfo data using CLI (bare metal)
const getMediaInfoDataCLI = (filePath, inputs) => {
    // Get platform-specific MediaInfo path
    const mediaInfoPath = getPlatformSpecificPath(
        inputs.mediainfo_path_linux,
        inputs.mediainfo_path_windows
    );
    
    if (!mediaInfoPath || mediaInfoPath === 'disabled') {
        return null;
    }
    
    try {
        const { execSync } = require('child_process');
        
        // Execute MediaInfo CLI with JSON output
        const command = `${mediaInfoPath} --Output=JSON "${filePath}"`;
        const result = execSync(command, { encoding: 'utf8', timeout: 30000 });
        
        // Parse JSON result
        const mediaInfoData = JSON.parse(result);
        return mediaInfoData;
        
    } catch (err) {
        // If CLI fails, return error info for fallback handling
        return { error: true, message: err.message };
    }
};

// Function to get MediaInfo data using mediainfo.js (Docker)
const getMediaInfoDataJS = (filePath) => {
    if (!initializeMediaInfoJS()) {
        return null;
    }
    
    try {
        const fs = require('fs');
        
        // Read file as buffer
        const fileBuffer = fs.readFileSync(filePath);
        
        // Create MediaInfo instance
        const mediainfo = MediaInfoLib.MediaInfo({ format: 'object' });
        
        // Analyze the file
        const result = mediainfo.analyzeData(fileBuffer);
        
        return result;
    } catch (err) {
        // If MediaInfo.js fails, return null to fall back to ffprobe-only mode
        return null;
    }
};

// Function to get MediaInfo data using mediainfo.js (fallback for bare metal)
const getMediaInfoDataJSFallback = (filePath) => {
    try {
        // Try to initialize mediainfo.js even on bare metal as fallback
        if (!MediaInfoLib) {
            const paths = [
                '/app/Tdarr_Node/node_modules/mediainfo.js',
                './Tdarr_Node/node_modules/mediainfo.js',
                'mediainfo.js'
            ];
            
            for (const path of paths) {
                try {
                    MediaInfoLib = require(path);
                    break;
                } catch (err) {
                    continue;
                }
            }
            
            if (!MediaInfoLib) {
                return null; // No mediainfo.js available
            }
        }
        
        const fs = require('fs');
        
        // Read file as buffer
        const fileBuffer = fs.readFileSync(filePath);
        
        // Create MediaInfo instance
        const mediainfo = MediaInfoLib.MediaInfo({ format: 'object' });
        
        // Analyze the file
        const result = mediainfo.analyzeData(fileBuffer);
        
        return result;
    } catch (err) {
        // If MediaInfo.js fails, return null to fall back to ffprobe-only mode
        return null;
    }
};

// Unified function to get MediaInfo data with fallback hierarchy
const getMediaInfoData = (filePath, inputs) => {
    if (detectDockerEnvironment()) {
        // Docker: Use mediainfo.js directly
        return getMediaInfoDataJS(filePath);
    } else {
        // Bare metal: Try CLI first, then mediainfo.js fallback, then ffprobe-only
        const cliResult = getMediaInfoDataCLI(filePath, inputs);
        
        if (cliResult && !cliResult.error) {
            // CLI worked successfully
            return cliResult;
        } else if (cliResult && cliResult.error) {
            // CLI failed, try mediainfo.js as fallback
            const jsResult = getMediaInfoDataJSFallback(filePath);
            if (jsResult) {
                return { 
                    fallbackUsed: true, 
                    fallbackMethod: 'mediainfo.js', 
                    originalError: cliResult.message, 
                    data: jsResult 
                };
            } else {
                return { 
                    fallbackUsed: true, 
                    fallbackMethod: 'ffprobe-only', 
                    originalError: cliResult.message, 
                    data: null 
                };
            }
        } else {
            // CLI disabled, use ffprobe-only
            return null;
        }
    }
};

// ===============================================
// ENHANCED STREAM ANALYSIS FUNCTIONS
// ===============================================

// Enhanced RTP hint track and timecode detection
const detectSpecialTracks = (stream, streamIndex, file, inputs) => {
    const result = {
        isSpecialTrack: false,
        trackType: '',
        detection_method: '',
        confidence: 'low',
        shouldDrop: false
    };
    
    const isDocker = detectDockerEnvironment();
    
    // Method 1: Use MediaInfo data (with fallback awareness)
    const mediaInfoData = getMediaInfoData(file._id, inputs);
    if (mediaInfoData) {
        let tracks = null;
        let actualData = mediaInfoData;
        
        // Handle fallback response format
        if (mediaInfoData.fallbackUsed && mediaInfoData.data) {
            actualData = mediaInfoData.data;
        }
        
        // Handle different MediaInfo output formats
        if (actualData.media && actualData.media.track) {
            tracks = actualData.media.track; // mediainfo.js format
        } else if (actualData.track) {
            tracks = actualData.track; // CLI JSON format
        }
        
        if (tracks) {
            // Find corresponding track (accounting for general track at index 0)
            const trackIndex = streamIndex + 1;
            if (trackIndex < tracks.length) {
                const track = tracks[trackIndex];
                
                // Check for RTP hint tracks
                if ((track['@type'] === 'Other' || track.Type === 'Other') && 
                    (track.Format === 'RTP' || track.format === 'RTP')) {
                    result.isSpecialTrack = true;
                    result.trackType = 'RTP Hint';
                    let method = 'MediaInfo Format=RTP';
                    if (mediaInfoData.fallbackUsed) {
                        method += ` (fallback: ${mediaInfoData.fallbackMethod})`;
                    } else {
                        method += ` (${isDocker ? 'js' : 'CLI'})`;
                    }
                    result.detection_method = method;
                    result.confidence = 'high';
                    result.shouldDrop = true;
                    return result;
                }
                
                if ((track.CodecID === 'rtp ' || track.codec_id === 'rtp ') ||
                    (track.CodecID === 'hint' || track.codec_id === 'hint')) {
                    result.isSpecialTrack = true;
                    result.trackType = 'RTP Hint';
                    let method = 'MediaInfo CodecID=rtp/hint';
                    if (mediaInfoData.fallbackUsed) {
                        method += ` (fallback: ${mediaInfoData.fallbackMethod})`;
                    } else {
                        method += ` (${isDocker ? 'js' : 'CLI'})`;
                    }
                    result.detection_method = method;
                    result.confidence = 'high';
                    result.shouldDrop = true;
                    return result;
                }
                
                // Check for QuickTime timecode tracks - always drop for MKV
                if ((track['@type'] === 'Other' || track.Type === 'Other') && 
                    ((track.Type === 'Time code' || track.type === 'Time code') ||
                     (track.Format === 'QuickTime TC' || track.format === 'QuickTime TC') ||
                     (track.Format === 'Time Code' || track.format === 'Time Code'))) {
                    result.isSpecialTrack = true;
                    result.trackType = 'QuickTime Timecode';
                    let method = 'MediaInfo Type=Time code';
                    if (mediaInfoData.fallbackUsed) {
                        method += ` (fallback: ${mediaInfoData.fallbackMethod})`;
                    } else {
                        method += ` (${isDocker ? 'js' : 'CLI'})`;
                    }
                    result.detection_method = method;
                    result.confidence = 'high';
                    result.shouldDrop = true; // Always drop for MKV
                    return result;
                }
                
                // Additional timecode detection methods - always drop for MKV
                if ((track.Format === 'timecode' || track.format === 'timecode') ||
                    (track.CodecID === 'tmcd' || track.codec_id === 'tmcd')) {
                    result.isSpecialTrack = true;
                    result.trackType = 'Timecode';
                    let method = 'MediaInfo Format/CodecID=timecode/tmcd';
                    if (mediaInfoData.fallbackUsed) {
                        method += ` (fallback: ${mediaInfoData.fallbackMethod})`;
                    } else {
                        method += ` (${isDocker ? 'js' : 'CLI'})`;
                    }
                    result.detection_method = method;
                    result.confidence = 'high';
                    result.shouldDrop = true; // Always drop for MKV
                    return result;
                }
                
                if ((track.Title && track.Title.toLowerCase().includes('hint')) ||
                    (track.title && track.title.toLowerCase().includes('hint'))) {
                    result.isSpecialTrack = true;
                    result.trackType = 'RTP Hint';
                    let method = 'MediaInfo Title contains hint';
                    if (mediaInfoData.fallbackUsed) {
                        method += ` (fallback: ${mediaInfoData.fallbackMethod})`;
                    } else {
                        method += ` (${isDocker ? 'js' : 'CLI'})`;
                    }
                    result.detection_method = method;
                    result.confidence = 'medium';
                    result.shouldDrop = true;
                    return result;
                }
            }
        }
    }

    // Method 2: Use existing file.mediaInfo if available (from Tdarr)
    if (file.mediaInfo && file.mediaInfo.track && file.mediaInfo.track[streamIndex + 1]) {
        const mediaInfoTrack = file.mediaInfo.track[streamIndex + 1];
        
        // Check for RTP hint tracks
        if (mediaInfoTrack.Type === 'Hint' && 
            (mediaInfoTrack.Format === 'RTP' || mediaInfoTrack.CodecID === 'rtp')) {
            result.isSpecialTrack = true;
            result.trackType = 'RTP Hint';
            result.detection_method = 'Tdarr MediaInfo (Type=Hint, Format/CodecID=RTP)';
            result.confidence = 'high';
            result.shouldDrop = true;
            return result;
        }
        
        // Check for QuickTime timecode tracks - always drop for MKV
        if (mediaInfoTrack.Type === 'Time code' || 
            mediaInfoTrack.Format === 'QuickTime TC' ||
            mediaInfoTrack.Format === 'Time Code') {
            result.isSpecialTrack = true;
            result.trackType = 'QuickTime Timecode';
            result.detection_method = 'Tdarr MediaInfo (Type=Time code)';
            result.confidence = 'high';
            result.shouldDrop = true; // Always drop for MKV
            return result;
        }
    }
    
    // Method 3: Fallback to ffprobe-based detection
    const codecType = (stream.codec_type || '').toLowerCase();
    const codecName = (stream.codec_name || '').toLowerCase();
    
    // Check for obvious RTP hint indicators
    if (codecType === 'data' && (codecName === 'rtp' || codecName === 'hint')) {
        result.isSpecialTrack = true;
        result.trackType = 'RTP Hint';
        result.detection_method = 'ffprobe codec detection';
        result.confidence = 'medium';
        result.shouldDrop = true;
        return result;
    }
    
    if (codecName === 'rtp' || codecName === 'hint') {
        result.isSpecialTrack = true;
        result.trackType = 'RTP Hint';
        result.detection_method = 'ffprobe codec name';
        result.confidence = 'medium';
        result.shouldDrop = true;
        return result;
    }
    
    // Check for timecode tracks in ffprobe - always drop for MKV
    if (codecName === 'timecode' || codecName === 'tmcd') {
        result.isSpecialTrack = true;
        result.trackType = 'Timecode';
        result.detection_method = `ffprobe codec_name=${codecName}`;
        result.confidence = 'medium';
        result.shouldDrop = true; // Always drop for MKV
        return result;
    }
    
    if (stream.codec_tag_string && stream.codec_tag_string.toLowerCase().trim() === 'rtp') {
        result.isSpecialTrack = true;
        result.trackType = 'RTP Hint';
        result.detection_method = 'ffprobe codec_tag_string=rtp';
        result.confidence = 'medium';
        result.shouldDrop = true;
        return result;
    }
    
    if (stream.codec_tag_string && (stream.codec_tag_string.toLowerCase() === 'tmcd' || 
                                    stream.codec_tag_string.toLowerCase() === 'time')) {
        result.isSpecialTrack = true;
        result.trackType = 'Timecode';
        result.detection_method = `ffprobe codec_tag_string=${stream.codec_tag_string}`;
        result.confidence = 'medium';
        result.shouldDrop = true; // Always drop for MKV
        return result;
    }
    
    if (stream.handler_name && stream.handler_name.toLowerCase().includes('hint')) {
        result.isSpecialTrack = true;
        result.trackType = 'RTP Hint';
        result.detection_method = 'ffprobe handler_name contains hint';
        result.confidence = 'low';
        result.shouldDrop = true;
        return result;
    }
    
    if (stream.tags && stream.tags.handler_name && stream.tags.handler_name.toLowerCase().includes('hint')) {
        result.isSpecialTrack = true;
        result.trackType = 'RTP Hint';
        result.detection_method = 'ffprobe tags.handler_name contains hint';
        result.confidence = 'low';
        result.shouldDrop = true;
        return result;
    }
    
    // Check for unusually high stream IDs (common for hint tracks)
    if (stream.id && stream.id >= 65535) {
        result.isSpecialTrack = true;
        result.trackType = 'RTP Hint';
        result.detection_method = 'ffprobe high stream ID (>= 65535)';
        result.confidence = 'low';
        result.shouldDrop = true;
        return result;
    }
    
    // Check specific codec tags
    if (stream.codec_tag === 'rtp ' || stream.codec_tag === 'hint') {
        result.isSpecialTrack = true;
        result.trackType = 'RTP Hint';
        result.detection_method = 'ffprobe codec_tag';
        result.confidence = 'medium';
        result.shouldDrop = true;
        return result;
    }
    
    if (stream.codec_tag === 'tmcd' || stream.codec_tag === 'time') {
        result.isSpecialTrack = true;
        result.trackType = 'Timecode';
        result.detection_method = 'ffprobe codec_tag';
        result.confidence = 'medium';
        result.shouldDrop = true; // Always drop for MKV
        return result;
    }
    
    return result;
};

// Enhanced WebVTT detection function
const detectWebVTT = (stream, streamIndex, file) => {
    const result = { detected: false, reason: '' };
    
    try {
        // Method 1: Check MediaInfo CodecID (most reliable for WebVTT)
        if (file.mediaInfo && file.mediaInfo.track && file.mediaInfo.track[streamIndex + 1]) {
            const mediaInfoTrack = file.mediaInfo.track[streamIndex + 1];
            if (mediaInfoTrack.CodecID === 'S_TEXT/WEBVTT') {
                result.detected = true;
                result.reason = 'MediaInfo CodecID confirms WebVTT';
                return result;
            }
        }
        
        // Method 2: Check handler_name tag
        if (stream.tags && stream.tags.handler_name) {
            const handlerName = stream.tags.handler_name.toLowerCase();
            if (handlerName.includes('webvtt') || handlerName.includes('web vtt')) {
                result.detected = true;
                result.reason = 'handler_name contains WebVTT';
                return result;
            }
        }
        
        // Method 3: Check codec_tag_string
        if (stream.codec_tag_string) {
            const codecTag = stream.codec_tag_string.toLowerCase();
            if (codecTag.includes('wvtt') || codecTag === 'wvtt') {
                result.detected = true;
                result.reason = 'codec_tag_string indicates WebVTT (wvtt)';
                return result;
            }
        }
        
        // Method 4: Check codec_tag
        if (stream.codec_tag === '0x77767474' || stream.codec_tag === 'wvtt') {
            result.detected = true;
            result.reason = 'codec_tag matches WebVTT identifier';
            return result;
        }
        
        // Method 5: Check for specific metadata combinations
        if (stream.tags) {
            const hasLanguage = stream.tags.language || stream.tags.lang;
            const hasTitle = stream.tags.title;
            const hasCreationTime = stream.tags.creation_time;
            
            if (hasLanguage && hasTitle && hasCreationTime) {
                const title = (stream.tags.title || '').toLowerCase();
                if (title.includes('web') || title.includes('vtt') || title.includes('caption')) {
                    result.detected = true;
                    result.reason = 'metadata pattern suggests WebVTT';
                    return result;
                }
            }
        }
        
        // Method 6: Check disposition flags
        if (stream.disposition && stream.disposition.captions === 1) {
            result.detected = true;
            result.reason = 'disposition flags suggest WebVTT captions';
            return result;
        }
        
    } catch (err) {
        // Error in detection, assume not WebVTT
    }
    
    return result;
};

// Helper function to check subtitle compatibility for MKV only
const checkSubtitleCompatibility = (codecName) => {
    const result = { convert: false, drop: false, targetCodec: '' };

    // Only MKV logic - removed MP4/AVI cases
    if (codecName === 'mov_text') {
        result.convert = true;
        result.targetCodec = 'subrip';
    } else if (codecName === 'webvtt') {
        result.convert = true;
        result.targetCodec = 'subrip';
    } else if (['eia_608', 'timed_id3'].includes(codecName)) {
        result.convert = true;
        result.drop = true;
    }

    return result;
};

// ===============================================
// QUALITY ASSURANCE AND VALIDATION FUNCTIONS
// ===============================================

// Enhanced quality assurance and validation function
const performQualityAssurance = (file, inputs) => {
    const result = {
        canProcess: true,
        errorMessage: '',
        warnings: [],
    };

    if (!inputs.enable_qa_checks) {
        return result;
    }

    try {
        if (!file.ffProbeData.streams || file.ffProbeData.streams.length === 0) {
            result.canProcess = false;
            result.errorMessage = '☒Critical: No streams detected in file. File may be corrupted.';
            return result;
        }

        // Check for at least one video stream
        let hasVideo = false;
        for (const stream of file.ffProbeData.streams) {
            if (stream && stream.codec_type && stream.codec_type.toLowerCase() === 'video') {
                hasVideo = true;
                break;
            }
        }
        if (!hasVideo) {
            result.canProcess = false;
            result.errorMessage = '☒Critical: No video streams found. This plugin requires video files.';
            return result;
        }

        // Validate preferred language codes if provided
        if (inputs.preferred_subtitle_languages) {
            const languages = parsePreferredLanguages(inputs.preferred_subtitle_languages);
            const invalidCodes = languages.filter(lang => !isValidLanguageCode(lang));
            
            if (invalidCodes.length > 0) {
                result.warnings.push(`⚠Warning: Invalid language codes found: ${invalidCodes.join(', ')}. Use ISO 639-1 (2-letter) or ISO 639-2 (3-letter) codes.`);
            }
        }

        // Check for duration mismatches
        const durationCheck = checkStreamDurations(file);
        if (durationCheck.hasMismatch) {
            result.warnings.push(`⚠Warning: ${durationCheck.warning}`);
        }

        // Analyze stream bitrates
        const bitrateAnalysis = analyzeStreamBitrates(file);
        if (bitrateAnalysis.warnings.length > 0) {
            result.warnings = result.warnings.concat(bitrateAnalysis.warnings);
        }

        // Check for potential circular dependencies in subtitle conversion
        const subtitleValidation = validateSubtitleConversions(file);
        if (!subtitleValidation.valid) {
            result.warnings.push(`⚠Warning: ${subtitleValidation.warning}`);
        }

    } catch (err) {
        result.warnings.push(`⚠Warning: QA check encountered error: ${err.message}`);
    }

    return result;
};

// Check for duration mismatches between streams
const checkStreamDurations = (file) => {
    const result = { hasMismatch: false, warning: '' };
    
    try {
        const durations = [];
        
        for (const stream of file.ffProbeData.streams) {
            if (stream && stream.duration && !isNaN(parseFloat(stream.duration))) {
                durations.push(parseFloat(stream.duration));
            }
        }
        
        if (durations.length > 1) {
            const maxDuration = Math.max(...durations);
            const minDuration = Math.min(...durations);
            const difference = maxDuration - minDuration;
            
            // Flag if difference is more than 1 second
            if (difference > 1.0) {
                result.hasMismatch = true;
                result.warning = `Stream duration mismatch detected (${difference.toFixed(2)}s difference). File may have sync issues.`;
            }
        }
    } catch (err) {
        // Error in duration check, but don't stop processing
    }
    
    return result;
};

// Analyze stream bitrates for anomalies
const analyzeStreamBitrates = (file) => {
    const result = { warnings: [] };
    
    try {
        for (let index = 0; index < file.ffProbeData.streams.length; index++) {
            const stream = file.ffProbeData.streams[index];
            if (!stream || !stream.codec_type) continue;
            
            const codecType = stream.codec_type.toLowerCase();
            const bitRate = stream.bit_rate ? parseInt(stream.bit_rate) : null;
            
            if (bitRate) {
                // Check for unusually high/low bitrates
                if (codecType === 'video') {
                    if (bitRate > 100000000) { // 100 Mbps
                        result.warnings.push(`⚠Warning: Very high video bitrate detected (${Math.round(bitRate/1000000)}Mbps) in stream ${index}.`);
                    } else if (bitRate < 100000) { // 100 kbps
                        result.warnings.push(`⚠Warning: Very low video bitrate detected (${Math.round(bitRate/1000)}kbps) in stream ${index}.`);
                    }
                } else if (codecType === 'audio') {
                    if (bitRate > 2000000) { // 2 Mbps
                        result.warnings.push(`⚠Warning: Very high audio bitrate detected (${Math.round(bitRate/1000)}kbps) in stream ${index}.`);
                    } else if (bitRate < 32000) { // 32 kbps
                        result.warnings.push(`⚠Warning: Very low audio bitrate detected (${Math.round(bitRate/1000)}kbps) in stream ${index}.`);
                    }
                }
            }
        }
    } catch (err) {
        // Error in bitrate analysis, but don't stop processing
    }
    
    return result;
};

// Validate subtitle conversions for MKV only
const validateSubtitleConversions = (file) => {
    const result = { valid: true, warning: '' };
    
    try {
        // Force conform is always enabled - removed input check
        let hasProblematicSubs = false;
        
        for (const stream of file.ffProbeData.streams) {
            if (!stream || !stream.codec_type || stream.codec_type.toLowerCase() !== 'subtitle') continue;
            
            const codecName = stream.codec_name ? stream.codec_name.toLowerCase() : '';
            
            // Check for subtitle formats that might lose formatting during conversion for MKV
            if (['ass', 'ssa'].includes(codecName)) {
                hasProblematicSubs = true;
            }
        }
        
        if (hasProblematicSubs) {
            result.valid = false;
            result.warning = 'Converting styled subtitles (ASS/SSA) to SRT will lose formatting and styling.';
        }
    } catch (err) {
        // Error in subtitle validation, but don't stop processing
    }
    
    return result;
};

// ===============================================
// MAIN PLUGIN FUNCTION
// ===============================================

const plugin = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lib = require('../../../../../methods/lib')();
        const path = require('path');
        
        // Load default values
        args.inputs = lib.loadDefaultValues(args.inputs, details);
        
        // Initialize logger
        const logger = new Logger(args.inputs.logging_level);
        
        // Performance tracking
        const startTime = Date.now();
        const processingMetrics = {
            environmentDetectionTime: 0,
            streamAnalysisTime: 0,
            qualityAssuranceTime: 0,
            totalTime: 0
        };

        logger.section('DeNiX Enhanced MKV Pre-Process: Advanced Cleanup, Remux & Subtitle Language Filtering');
        logger.info(`📁 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`📊 Container: ${args.inputFileObj.container} | Streams: ${args.inputFileObj.ffProbeData.streams.length}`);

        // Parse preferred languages
        const preferredLanguages = parsePreferredLanguages(args.inputs.preferred_subtitle_languages);
        if (preferredLanguages.length > 0) {
            logger.info(`🌐 Preferred subtitle languages: ${preferredLanguages.join(', ')}`);
        } else {
            logger.info(`🌐 No language filtering (keeping all languages during conversion)`);
        }

        // ===============================================
		// STEP 1: ENVIRONMENT DETECTION AND MEDIAINFO SETUP
		// ===============================================

		logger.subsection('Step 1: Environment detection and MediaInfo setup');
		const envStartTime = Date.now();

		const isDocker = detectDockerEnvironment();
		if (isDocker) {
			const mediaInfoJSStatus = initializeMediaInfoJS();
			if (mediaInfoJSStatus) {
				logger.success('Docker environment detected - using built-in mediainfo.js module');
			} else {
				logger.warn('Docker environment detected but mediainfo.js not available - using ffprobe-only mode');
			}
		} else {
			// Get platform-specific MediaInfo path
			const mediaInfoPath = getPlatformSpecificPath(
				args.inputs.mediainfo_path_linux,
				args.inputs.mediainfo_path_windows
			);
			
			if (mediaInfoPath && mediaInfoPath !== 'disabled') {
				logger.info(`Bare metal environment detected - testing MediaInfo CLI: ${mediaInfoPath}`);
				
				// Test MediaInfo CLI availability on bare metal
				try {
					const { execSync } = require('child_process');
					const testResult = execSync(`${mediaInfoPath} --version`, { encoding: 'utf8', timeout: 5000 });
					logger.success(`MediaInfo CLI test successful: ${testResult.split('\n')[0]}`);
				} catch (err) {
					logger.error(`MediaInfo CLI test failed (${mediaInfoPath}): ${err.message}`);
					
					// Test if mediainfo.js is available as fallback
					let jsAvailable = false;
					const jsPaths = ['mediainfo.js', '/app/Tdarr_Node/node_modules/mediainfo.js', './Tdarr_Node/node_modules/mediainfo.js'];
					for (const jsPath of jsPaths) {
						try {
							require(jsPath);
							jsAvailable = true;
							break;
						} catch (jsErr) {
							continue;
						}
					}
					
					if (jsAvailable) {
						logger.success('Fallback to built-in mediainfo.js module available');
					} else {
						logger.warn('No MediaInfo fallback available - will use ffprobe-only mode');
					}
				}
			} else {
				logger.info('Bare metal environment - MediaInfo disabled, using ffprobe-only mode');
			}
		}

		processingMetrics.environmentDetectionTime = Date.now() - envStartTime;

        // Validate input file
        if (args.inputFileObj.fileMedium !== 'video') {
            logger.warn('Not a video file. Skipping.');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        // Force MKV container - removed container input validation
        const targetContainer = '.mkv';

        // Validate ffProbeData
        if (!args.inputFileObj.ffProbeData || !args.inputFileObj.ffProbeData.streams || !Array.isArray(args.inputFileObj.ffProbeData.streams)) {
            logger.error('Invalid ffProbe data, cannot analyze streams.');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        
        logger.subsection('Step 2: Quality assurance and validation');
        const qaStartTime = Date.now();
        
        const validationResult = performQualityAssurance(args.inputFileObj, args.inputs);
        if (!validationResult.canProcess) {
            logger.error(validationResult.errorMessage);
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }
        if (validationResult.warnings.length > 0) {
            validationResult.warnings.forEach(warning => logger.warn(warning));
        }

        processingMetrics.qualityAssuranceTime = Date.now() - qaStartTime;

        // ===============================================
        // STEP 3: STREAM ANALYSIS AND PROCESSING PLAN
        // ===============================================
        
        logger.subsection('Step 3: Analyzing streams and building processing plan');
        const analysisStartTime = Date.now();

        // Initialize variables
        let ffmpegArgs = [];
        let needsProcessing = false;
        let videoIdx = 0;
        let subtitleIdx = 0;
        let inputArgs = [];
        let outputArgs = [];

        const issues = {
            hasDataStreams: false,
            hasImageStreams: false,
            hasAttachments: false,
            needsSubtitleConversion: false,
            needsContainerChange: false,
            needsChapterRemoval: false,
            needsStreamReordering: false,
            hasInvalidSubtitles: false,
            hasWebVTTSubtitles: false,
            hasRTPHintTracks: false,
            hasTimecodeTracks: false,
            languageFiltered: false,
        };

        // Log current stream layout
        logger.extended('Current stream layout:');
        for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
            const stream = args.inputFileObj.ffProbeData.streams[i];
            const type = stream.codec_type?.toLowerCase() || 'unknown';
            
            if (type === 'video') {
                logger.extended(`  ${i}: Video - ${stream.codec_name} ${stream.width}x${stream.height}`);
            } else if (type === 'audio') {
                const lang = stream.tags?.language || 'und';
                const title = stream.tags?.title || '';
                const bitrate = stream.bit_rate ? ` (${Math.round(parseInt(stream.bit_rate)/1000)}k)` : '';
                logger.extended(`  ${i}: Audio - ${stream.codec_name} ${stream.channels}ch ${lang}${bitrate}${title ? ` "${title}"` : ''}`);
            } else if (type === 'subtitle') {
                const lang = stream.tags?.language || 'und';
                const title = stream.tags?.title || '';
                logger.extended(`  ${i}: Subtitle - ${stream.codec_name} ${lang}${title ? ` "${title}"` : ''}`);
            } else {
                logger.extended(`  ${i}: ${type} - ${stream.codec_name || 'unknown'}`);
            }
        }

        // Analyze streams for issues
        for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
            const stream = args.inputFileObj.ffProbeData.streams[i];
            
            if (!stream || !stream.codec_type) {
                continue; // Skip invalid streams
            }

            const codecType = stream.codec_type.toLowerCase();
            const codecName = stream.codec_name ? stream.codec_name.toLowerCase() : '';

            try {
                // Enhanced special track detection (RTP hints, timecode tracks, etc.)
                const specialTrackDetection = detectSpecialTracks(stream, i, args.inputFileObj, args.inputs);
                if (specialTrackDetection.isSpecialTrack) {
                    if (specialTrackDetection.trackType === 'RTP Hint') {
                        issues.hasRTPHintTracks = true;
                        issues.hasDataStreams = true;
                    } else if (specialTrackDetection.trackType === 'QuickTime Timecode' || specialTrackDetection.trackType === 'Timecode') {
                        issues.hasTimecodeTracks = true;
                        issues.hasDataStreams = true;
                    }
                    
                    logger.info(`Found ${specialTrackDetection.trackType} track in stream ${i} (${specialTrackDetection.detection_method}, confidence: ${specialTrackDetection.confidence})`);
                    
                    // Log fallback usage if applicable
                    const mediaInfoData = getMediaInfoData(args.inputFileObj._id, args.inputs);
                    if (mediaInfoData && mediaInfoData.fallbackUsed) {
                        if (mediaInfoData.fallbackMethod === 'mediainfo.js') {
                            logger.extended(`CLI failed, used mediainfo.js fallback (original error: ${mediaInfoData.originalError})`);
                        } else if (mediaInfoData.fallbackMethod === 'ffprobe-only') {
                            logger.extended(`CLI and mediainfo.js failed, using ffprobe detection (original error: ${mediaInfoData.originalError})`);
                        }
                    }
                    
                    if (specialTrackDetection.shouldDrop) {
                        outputArgs.push('-map', `-0:${i}`);
                        logger.info(`Dropping ${specialTrackDetection.trackType} track stream ${i} - not compatible with MKV`);
                    } else {
                        logger.success(`Keeping ${specialTrackDetection.trackType} track stream ${i} - compatible with MKV`);
                    }
                    
                    continue; // Skip further processing for special tracks
                }

                // Check for data streams
                if (args.inputs.remove_data_streams === true && codecType === 'data') {
                    issues.hasDataStreams = true;
                }

                // Check for attachment streams
                if (args.inputs.remove_attachments === true && codecType === 'attachment') {
                    issues.hasAttachments = true;
                }

                // Check for unwanted image format streams
                if (args.inputs.remove_image_streams === true && codecType === 'video') {
                    if (['mjpeg', 'png', 'gif'].includes(codecName)) {
                        issues.hasImageStreams = true;
                        outputArgs.push('-map', `-v:${videoIdx}`);
                    }
                    videoIdx++;
                }

                // Check for subtitle streams that might be WebVTT
                if (codecType === 'subtitle') {
                    if (!codecName || codecName === 'none' || codecName === '') {
                        const isWebVTT = detectWebVTT(stream, i, args.inputFileObj);
                        
                        if (isWebVTT.detected) {
                            issues.hasWebVTTSubtitles = true;
                            logger.success(`Found WebVTT subtitle stream ${i} (${isWebVTT.reason})`);
                            
                            // Force conform is always enabled
                            const webvttConversion = checkSubtitleCompatibility('webvtt');
                            if (webvttConversion.convert) {
                                issues.needsSubtitleConversion = true;
                                if (webvttConversion.drop) {
                                    outputArgs.push('-map', `-0:${i}`);
                                    logger.info(`Dropping WebVTT subtitle stream ${i} - not compatible with MKV`);
                                } else {
                                    // Apply language filtering during conversion
                                    const streamLanguage = stream.tags && stream.tags.language ? stream.tags.language.toLowerCase() : 'undefined';
                                    const keepLanguage = shouldKeepLanguageDuringConversion(streamLanguage, preferredLanguages);
                                    
                                    if (keepLanguage) {
                                        outputArgs.push(`-c:s:${subtitleIdx}`, webvttConversion.targetCodec);
                                        logger.info(`Converting WebVTT subtitle stream ${i} (${streamLanguage}) to embedded ${webvttConversion.targetCodec} for MKV compatibility`);
                                        if (preferredLanguages.length > 0) {
                                            issues.languageFiltered = true;
                                        }
                                        subtitleIdx++;
                                    } else {
                                        outputArgs.push('-map', `-0:${i}`);
                                        logger.info(`Dropping WebVTT subtitle stream ${i} - language '${streamLanguage}' not in preferred languages during conversion`);
                                        issues.languageFiltered = true;
                                    }
                                }
                            } else {
                                subtitleIdx++;
                            }
                        } else {
                            logger.warn(`Unknown subtitle format in stream ${i} (codec: ${codecName || 'none'}). Dropping for MKV conformance`);
                            issues.hasInvalidSubtitles = true;
                            outputArgs.push('-map', `-0:${i}`);
                            logger.info(`Dropping unknown subtitle stream ${i} for MKV conformance`);
                        }
                        continue;
                    }
                }

                // Check subtitle compatibility for MKV (force_conform is always enabled)
                if (codecType === 'subtitle') {
                    const needsConversion = checkSubtitleCompatibility(codecName);
                    if (needsConversion.convert) {
                        issues.needsSubtitleConversion = true;
                        if (needsConversion.drop) {
                            outputArgs.push('-map', `-0:${i}`);
                            logger.info(`Dropping incompatible subtitle stream ${i} (${codecName}) for MKV`);
                        } else {
                            // Apply language filtering during conversion
                            const streamLanguage = stream.tags && stream.tags.language ? stream.tags.language.toLowerCase() : 'undefined';
                            const keepLanguage = shouldKeepLanguageDuringConversion(streamLanguage, preferredLanguages);
                            
                            if (keepLanguage) {
                                outputArgs.push(`-c:s:${subtitleIdx}`, needsConversion.targetCodec);
                                logger.info(`Converting ${codecName} subtitle stream ${i} (${streamLanguage}) to embedded ${needsConversion.targetCodec} for MKV compatibility`);
                                if (preferredLanguages.length > 0) {
                                    issues.languageFiltered = true;
                                }
                                subtitleIdx++;
                            } else {
                                outputArgs.push('-map', `-0:${i}`);
                                logger.info(`Dropping ${codecName} subtitle stream ${i} - language '${streamLanguage}' not in preferred languages during conversion`);
                                issues.languageFiltered = true;
                            }
                        }
                    } else {
                        subtitleIdx++;
                    }
                }

                // Handle other incompatible streams for MKV conformance (force conform always enabled)
                if (['eia_608', 'timed_id3'].includes(codecName)) {
                    outputArgs.push('-map', `-0:${i}`);
                    logger.info(`Dropping incompatible stream ${i} (${codecName}) for MKV`);
                    issues.needsSubtitleConversion = true;
                }
            } catch (err) {
                logger.warn(`Error analyzing stream ${i}: ${err.message}`);
            }
        }

        // Check if container change is needed
        const currentContainer = args.inputFileObj.container.toLowerCase().replace('.', '');

        if (currentContainer !== 'mkv') {
            issues.needsContainerChange = true;
            logger.info(`File is ${currentContainer} but target is MKV, remuxing needed`);
        } else {
            logger.success(`File is already in MKV container`);
        }

        // Check if stream reordering is needed
        if (args.inputs.reorder_streams === true && args.inputFileObj.ffProbeData.streams.length > 0) {
            if (!args.inputFileObj.ffProbeData.streams[0] || args.inputFileObj.ffProbeData.streams[0].codec_type !== 'video') {
                issues.needsStreamReordering = true;
            }
        }

        // Handle chapter removal
        if (args.inputs.remove_chapters === true) {
            issues.needsChapterRemoval = true;
            outputArgs.push('-map_chapters', '-1');
        }

        // Handle data stream removal
        if (issues.hasDataStreams) {
            outputArgs.push('-dn');
            // Also remove data streams mapping for MKV conformance (force conform always enabled)
            outputArgs.push('-map', '-0:d');
        }

        // Handle attachment stream removal
        if (issues.hasAttachments) {
            outputArgs.push('-map', '-0:t');
        }

        // Handle timestamp fixing
        if (args.inputs.fix_timestamps === true) {
            const problematicContainers = ['ts', 'avi', 'mpg', 'mpeg'];
            if (problematicContainers.includes(args.inputFileObj.container.toLowerCase().replace('.', ''))) {
                inputArgs.push('-fflags', '+genpts');
                logger.info(`Applying timestamp fix for ${args.inputFileObj.container} container`);
            }
        }

        // Handle WebVTT subtitle decoder forcing
        if (issues.hasWebVTTSubtitles) {
            inputArgs.push('-c:s', 'webvtt');
            logger.info('Applying WebVTT decoder for proper subtitle detection');
        }

        processingMetrics.streamAnalysisTime = Date.now() - analysisStartTime;

        // Log findings
        logger.subsection('Processing summary');
        
        if (issues.hasRTPHintTracks) {
            logger.info('File has RTP hint tracks, removing for compatibility');
        }

        if (issues.hasTimecodeTracks) {
            logger.info('File has timecode tracks, removing for MKV compatibility');
        }

        if (issues.hasDataStreams && !issues.hasRTPHintTracks && !issues.hasTimecodeTracks) {
            logger.info('File has data streams, removing');
        } else if (args.inputs.remove_data_streams === true && !issues.hasDataStreams) {
            logger.success('File has no data streams');
        }

        if (issues.hasAttachments) {
            logger.info('File has attachment streams, removing');
        } else if (args.inputs.remove_attachments === true) {
            logger.success('File has no attachment streams');
        }

        if (issues.hasImageStreams) {
            logger.info('File has unwanted image format streams, removing');
        } else if (args.inputs.remove_image_streams === true) {
            logger.success('File has no unwanted image format streams');
        }

        if (issues.hasWebVTTSubtitles) {
            logger.info('File has WebVTT subtitle streams, applying decoder fix');
        }

        if (issues.hasInvalidSubtitles) {
            logger.info('File has invalid/unknown subtitle streams, removing for MKV conformance');
        }

        if (issues.languageFiltered) {
            logger.info('Applied language filtering during subtitle conversion to embedded SRT');
        }

        if (issues.needsChapterRemoval) {
            logger.info('Removing chapter information');
        }

        if (issues.needsStreamReordering) {
            logger.info('Video stream is not first, reordering streams');
        } else if (args.inputs.reorder_streams === true) {
            logger.success('Video stream is already first');
        }

        // Force conform is always enabled
        if (issues.needsSubtitleConversion) {
            logger.info('Subtitle stream conversions/removals applied for MKV conformance with embedded SRT');
        } else {
            logger.success('All streams are already compatible with MKV container');
        }

        // Determine if processing is needed
        const issueValues = Object.values(issues);
        needsProcessing = issueValues.includes(true);

        if (!needsProcessing) {
            logger.success('File already meets all criteria, no processing needed');
            
            // Performance metrics
            processingMetrics.totalTime = Date.now() - startTime;
            if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
                logger.subsection('Performance Metrics');
                logger.extended(`⏱️ Environment detection: ${processingMetrics.environmentDetectionTime}ms`);
                logger.extended(`⏱️ Quality assurance: ${processingMetrics.qualityAssuranceTime}ms`);
                logger.extended(`⏱️ Stream analysis: ${processingMetrics.streamAnalysisTime}ms`);
                logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
                
                const efficiency = processingMetrics.totalTime > 0 ? 
                    Math.round((args.inputFileObj.ffProbeData.streams.length / processingMetrics.totalTime) * 1000) : 0;
                logger.extended(`📈 Efficiency: ${efficiency} streams/second`);
            }
            
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        // ===============================================
        // STEP 4: BUILD AND EXECUTE FFMPEG COMMAND
        // ===============================================
        
        logger.subsection('Step 4: Building and executing FFmpeg command');
        
        // Build FFmpeg command
        const outputFilePath = `${(0, fileUtils_1.getPluginWorkDir)(args)}/${(0, fileUtils_1.getFileName)(args.inputFileObj._id)}${targetContainer}`;
        
        // Start with input file
        ffmpegArgs = ['-i', args.inputFileObj._id];
        
        // Add input arguments if any
        if (inputArgs.length > 0) {
            ffmpegArgs = [...inputArgs, ...ffmpegArgs];
        }

        // Handle stream reordering and mapping
        if (issues.needsStreamReordering) {
            // Build custom mapping based on what streams we want to keep
            ffmpegArgs.push('-map', '0:v?', '-map', '0:a?', '-map', '0:s?');
            
            // Only include data and attachment streams if we're not removing them
            if (!issues.hasDataStreams && !args.inputs.remove_data_streams) {
                ffmpegArgs.push('-map', '0:d?');
            }
            if (!issues.hasAttachments && !args.inputs.remove_attachments) {
                ffmpegArgs.push('-map', '0:t?');
            }
            
            logger.info('Applying stream reordering: Video → Audio → Subtitles → Data → Attachments');
        } else {
            // No reordering needed, but we still might have modifications
            ffmpegArgs.push('-map', '0');
        }

        // Set default copy for all streams
        ffmpegArgs.push('-c', 'copy');

        // Add output arguments (stream removals, conversions, etc.)
        if (outputArgs.length > 0) {
            ffmpegArgs.push(...outputArgs);
        }

        // Add max muxing queue size to prevent buffer issues
        ffmpegArgs.push('-max_muxing_queue_size', '9999');

        // Add output file
        ffmpegArgs.push(outputFilePath);

        // Log command details
        logger.success('FFmpeg command built successfully');
        logger.extended(`Output path: ${outputFilePath}`);
        logger.extended(`Input arguments: ${inputArgs.length > 0 ? inputArgs.join(' ') : 'None'}`);
        logger.extended(`Output arguments: ${outputArgs.length > 0 ? outputArgs.join(' ') : 'None'}`);
        logger.extended(`Stream reordering: ${issues.needsStreamReordering ? 'Yes' : 'No'}`);
        logger.extended(`Language filtering applied: ${issues.languageFiltered ? 'Yes' : 'No'}`);

        if (args.inputs.logging_level === 'debug') {
            logger.debug(`Full FFmpeg command: ${ffmpegArgs.join(' ')}`);
        }

        // Calculate total processing time before execution
        processingMetrics.totalTime = Date.now() - startTime;

        // Performance metrics
        if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Environment detection: ${processingMetrics.environmentDetectionTime}ms`);
            logger.extended(`⏱️ Quality assurance: ${processingMetrics.qualityAssuranceTime}ms`);
            logger.extended(`⏱️ Stream analysis: ${processingMetrics.streamAnalysisTime}ms`);
            logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
            
            const efficiency = processingMetrics.totalTime > 0 ? 
                Math.round((args.inputFileObj.ffProbeData.streams.length / processingMetrics.totalTime) * 1000) : 0;
            logger.extended(`📈 Efficiency: ${efficiency} streams/second`);
        }

        // Feature utilization summary
        if (args.inputs.logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            logger.debug(`🔧 Container change: ${issues.needsContainerChange ? 'Yes' : 'No'}`);
            logger.debug(`🔄 Stream reordering: ${issues.needsStreamReordering ? 'Yes' : 'No'}`);
            logger.debug(`🗑️ Data stream removal: ${issues.hasDataStreams ? 'Yes' : 'No'}`);
            logger.debug(`🖼️ Image stream removal: ${issues.hasImageStreams ? 'Yes' : 'No'}`);
            logger.debug(`📎 Attachment removal: ${issues.hasAttachments ? 'Yes' : 'No'}`);
            logger.debug(`📝 Subtitle conversion: ${issues.needsSubtitleConversion ? 'Yes' : 'No'}`);
            logger.debug(`🌐 Language filtering: ${issues.languageFiltered ? 'Yes' : 'No'}`);
            logger.debug(`📖 Chapter removal: ${issues.needsChapterRemoval ? 'Yes' : 'No'}`);
            logger.debug(`⏰ Timestamp fixing: ${inputArgs.includes('-fflags') ? 'Yes' : 'No'}`);
            logger.debug(`✅ MKV conformance: Always enabled`);
            logger.debug(`🛡️ QA checks: ${args.inputs.enable_qa_checks ? 'Yes' : 'No'}`);
            logger.debug(`🎯 Target container: MKV only`);
        }

        logger.success('🏁 Executing FFmpeg processing...');

        // Output current logs before FFmpeg execution
        args.jobLog(logger.getOutput());

        // ===============================================
        // EXECUTE FFMPEG
        // ===============================================

        // Get platform-specific FFmpeg path
        const ffmpegPath = getPlatformSpecificPath(
            args.inputs.ffmpeg_path_linux,
            args.inputs.ffmpeg_path_windows
        );

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
        logger.success('✅ MKV pre-processing complete!');
        
        // Final summary
        logger.subsection('Processing Summary');
        logger.success(`✅ Output: ${path.basename(outputFilePath)}`);
        logger.success(`📦 Container: MKV (forced)`);
        
        if (issues.needsSubtitleConversion) {
            logger.success(`🔄 Subtitles converted and embedded as SRT for MKV compatibility`);
        }
        
        if (issues.languageFiltered) {
            logger.success(`🌐 Language filtering applied during conversion`);
            if (preferredLanguages.length > 0) {
                logger.info(`   Kept languages: ${preferredLanguages.join(', ')} + undefined`);
            }
        }
        
        if (issues.hasRTPHintTracks || issues.hasTimecodeTracks) {
            logger.success(`🗑️ Removed incompatible special tracks`);
        }
        
        if (issues.needsContainerChange) {
            logger.success(`📦 Container converted to MKV`);
        }
        
        if (issues.needsStreamReordering) {
            logger.success(`🔄 Streams reordered optimally`);
        }

        logger.info('🔄 Ready for next stage processing');
        logger.info('=== End of Enhanced MKV Pre-Processing ===');

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