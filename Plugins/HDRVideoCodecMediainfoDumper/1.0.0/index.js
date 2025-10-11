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

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details
const details = () => ({
    name: '🎯 DeNiX Enhanced Video Analysis: Comprehensive Codec & HDR Detection',
    description: 'Advanced video analysis system combining codec detection, HDR format analysis, and MediaInfo integration. Detects AV1, VVC/H.266, HEVC, HDR10+, Dolby Vision profiles with comprehensive MediaInfo JSON dumping and intelligent routing based on video characteristics.',
    style: {
		borderColor: '#7C3AED',
		backgroundColor: 'rgba(124, 58, 237, 0.1)',
		borderWidth: '3px',
		borderStyle: 'solid',
		borderImage: 'linear-gradient(45deg, #7C3AED, #EC4899, #F59E0B, #10B981, #3B82F6, #8B5CF6) 1',
		// Enhanced bright violet glow with 10 layers - expanded reach with graduated opacity
		boxShadow: `
			0 0 10px rgba(124, 58, 237, 0.5),
			0 0 25px rgba(124, 58, 237, 0.46),
			0 0 40px rgba(124, 58, 237, 0.42),
			0 0 55px rgba(124, 58, 237, 0.39),
			0 0 70px rgba(124, 58, 237, 0.35),
			0 0 85px rgba(124, 58, 237, 0.31),
			0 0 100px rgba(124, 58, 237, 0.27),
			0 0 115px rgba(124, 58, 237, 0.23),
			0 0 130px rgba(124, 58, 237, 0.19),
			0 0 145px rgba(124, 58, 237, 0.17),
			0 0 160px rgba(124, 58, 237, 0.15),
			inset 0 0 20px rgba(124, 58, 237, 0.4)
		`,
		background: 'linear-gradient(45deg, #7C3AED, #EC4899, #F59E0B, #10B981, #3B82F6, #8B5CF6)',
		color: '#ffffff',
		textShadow: '0 0 15px rgba(124, 58, 237, 0.8), 0 0 25px rgba(139, 92, 246, 0.6)',
	},
    tags: 'video,codec,hdr,av1,vvc,h266,hevc,dolby-vision,hdr10+,mediainfo,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🎯',
    inputs: [
        {
            label: '🔍 Enable Debug Logging',
            name: 'debugMode',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable detailed logging for codec and HDR detection processes',
        },
        {
            label: '📁 Enable MediaInfo JSON Export',
            name: 'enableJsonExport',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Export comprehensive MediaInfo analysis as JSON file (filename_before.json)',
        },
        {
            label: '🐧 MediaInfo Path (Linux)',
            name: 'mediainfoPathLinux',
            type: 'string',
            defaultValue: 'mediainfo',
            inputUI: { type: 'text' },
            tooltip: 'Path to MediaInfo binary. Default: "mediainfo" (system PATH). Set to "disabled" for ffprobe-only mode.',
        },
        {
            label: '🪟 MediaInfo Path (Windows)',
            name: 'mediainfoPathWindows',
            type: 'string',
            defaultValue: 'mediainfo.exe',
            inputUI: { type: 'text' },
            tooltip: 'Path to MediaInfo binary. Default: "mediainfo.exe" (system PATH). Set to "disabled" for ffprobe-only mode.',
        },
		{
            label: '🐧 FFprobe Path (Linux)',
            name: 'ffprobePathLinux',
            type: 'string',
            defaultValue: 'ffprobe',
            inputUI: { type: 'text' },
            tooltip: 'Path to FFprobe binary. Default: "ffprobe" (system PATH). Set to "disabled" to skip ffprobe fallback.',
        },
        {
            label: '🪟 FFprobe Path (Windows)',
            name: 'ffprobePathWindows',
            type: 'string',
            defaultValue: 'ffprobe.exe',
            inputUI: { type: 'text' },
            tooltip: 'Path to FFprobe binary. Default: "ffprobe.exe" (system PATH). Set to "disabled" to skip ffprobe fallback.',
        },
        {
            label: '🔄 Force Overwrite JSON',
            name: 'forceOverwrite',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Overwrite existing JSON files without prompting',
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
            label: '⏱️ Show Performance Metrics',
            name: 'showPerformanceMetrics',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Display processing timing and performance statistics',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: '🚀 AV1 codec detected - Continue to AV1-specific processing',
        },
        {
            number: 2,
            tooltip: '🔮 VVC/H.266 codec detected - Continue to VVC-specific processing',
        },
        {
            number: 3,
            tooltip: '⚡ HDR10+ detected - Continue to HDR10+ processing',
        },
        {
            number: 4,
            tooltip: '🎬 Dolby Vision Profile 8 detected - Continue to DV P8 processing',
        },
        {
            number: 5,
            tooltip: '🎬 Dolby Vision Profile 7 detected - Continue to DV P7 processing',
        },
        {
            number: 6,
            tooltip: '🎬 Dolby Vision Profile 5 detected - Continue to DV P5 processing',
        },
        {
            number: 7,
            tooltip: '🎬 Dolby Vision Profile 4 detected - Continue to DV P4 processing',
        },
        {
            number: 8,
            tooltip: '📺 Standard codec/HDR detected - Continue to standard processing',
        },
        {
            number: 9,
            tooltip: '❌ Error occurred during analysis',
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

    banner(message) {
        const border = '═'.repeat(Math.min(message.length + 4, 60));
        this.output.push(`\n╔${border}╗`);
        this.output.push(`║  ${message.padEnd(Math.min(message.length, 56))}  ║`);
        this.output.push(`╚${border}╝`);
    }

    getOutput() {
        return this.output.join('\n');
    }

    clear() {
        this.output = [];
    }
}

// ===============================================
// MEDIAINFO INTEGRATION
// ===============================================

// Performance timer helper
const createTimer = () => {
    const startTime = process.hrtime.bigint();
    return {
        stop: () => {
            const endTime = process.hrtime.bigint();
            return Number(endTime - startTime) / 1000000; // Convert to milliseconds
        }
    };
};

// MediaInfo CLI function
const runMediaInfoCLI = async (filePath, mediainfoPathLinux, mediainfoPathWindows) => {
    // Determine which path to use based on platform
    const isWindows = process.platform === 'win32';
    const mediaInfoPath = isWindows ? mediainfoPathWindows : mediainfoPathLinux;
    
    if (mediaInfoPath === 'disabled') {
        throw new Error('MediaInfo is disabled - set appropriate mediainfo_path for your platform to enable');
    }
    
    try {
        const { execSync } = require('child_process');
        const command = `"${mediaInfoPath}" --Output=JSON --Full "${filePath}"`;
        
        const output = execSync(command, { 
            encoding: 'utf8',
            shell: true,
            timeout: 120000, // 2 minute timeout for large files
            maxBuffer: 50 * 1024 * 1024 // 50MB buffer for very detailed output
        });
        
        return JSON.parse(output);
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            throw new Error('MediaInfo analysis timed out (file may be too large or corrupted)');
        }
        if (error.message.includes('Unexpected token')) {
            throw new Error('MediaInfo returned invalid JSON (file may be corrupted)');
        }
        throw new Error(`MediaInfo execution failed: ${error.message}`);
    }
};

// FFprobe fallback function
const runFFprobeFallback = async (filePath, ffprobePathLinux, ffprobePathWindows) => {
    // Determine which path to use based on platform
    const isWindows = process.platform === 'win32';
    const ffprobePath = isWindows ? ffprobePathWindows : ffprobePathLinux;
    
    if (ffprobePath === 'disabled') {
        throw new Error('FFprobe is disabled - set appropriate ffprobe_path for your platform to enable');
    }
    
    try {
        const { execSync } = require('child_process');
        
        const command = `"${ffprobePath}" -v quiet -print_format json -show_format -show_streams "${filePath}"`;
        
        const output = execSync(command, { 
            encoding: 'utf8',
            timeout: 60000 // 1 minute timeout
        });
        
        const ffprobeData = JSON.parse(output);
        
        // Convert ffprobe format to MediaInfo-like format for consistency
        const convertedData = {
            media: {
                '@ref': filePath,
                track: []
            }
        };
        
        // Add general track
        if (ffprobeData.format) {
            const generalTrack = {
                '@type': 'General',
                Format: ffprobeData.format.format_name || 'Unknown',
                Duration: ffprobeData.format.duration ? parseFloat(ffprobeData.format.duration) : undefined,
                FileSize: ffprobeData.format.size ? parseInt(ffprobeData.format.size) : undefined,
                BitRate: ffprobeData.format.bit_rate ? parseInt(ffprobeData.format.bit_rate) : undefined
            };
            
            // Remove undefined properties
            Object.keys(generalTrack).forEach(key => {
                if (generalTrack[key] === undefined) {
                    delete generalTrack[key];
                }
            });
            
            convertedData.media.track.push(generalTrack);
        }
        
        // Add stream tracks
        if (ffprobeData.streams && Array.isArray(ffprobeData.streams)) {
            ffprobeData.streams.forEach(stream => {
                if (!stream || !stream.codec_type) {
                    return; // Skip invalid streams
                }
                
                const track = {
                    '@type': stream.codec_type === 'video' ? 'Video' : 
                             stream.codec_type === 'audio' ? 'Audio' : 
                             stream.codec_type === 'subtitle' ? 'Text' : 'Other',
                    Format: stream.codec_name || 'Unknown',
                    ID: stream.index !== undefined ? stream.index : undefined,
                    Duration: stream.duration ? parseFloat(stream.duration) : undefined
                };
                
                // Add type-specific properties
                if (stream.codec_type === 'video') {
                    track.Width = stream.width || undefined;
                    track.Height = stream.height || undefined;
                    track.FrameRate = stream.r_frame_rate || undefined;
                    track.BitRate = stream.bit_rate ? parseInt(stream.bit_rate) : undefined;
                } else if (stream.codec_type === 'audio') {
                    track.Channels = stream.channels || undefined;
                    track.SamplingRate = stream.sample_rate ? parseInt(stream.sample_rate) : undefined;
                    track.BitRate = stream.bit_rate ? parseInt(stream.bit_rate) : undefined;
                }
                
                // Remove undefined properties
                Object.keys(track).forEach(key => {
                    if (track[key] === undefined) {
                        delete track[key];
                    }
                });
                
                convertedData.media.track.push(track);
            });
        }
        
        return convertedData;
    } catch (error) {
        throw new Error(`FFprobe execution failed: ${error.message}`);
    }
};

// ===============================================
// VIDEO CODEC DETECTION LOGIC
// ===============================================

const detectVideoCodec = (streams, logger) => {
    const result = {
        codec: 'other',
        codecName: '',
        confidence: 'low',
        detectionMethod: 'none',
        analysisDetails: []
    };

    logger.debug('Starting video codec detection...');
    
    // Look for video streams
    const videoStreams = [];
    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        if (stream.codec_type === 'video') {
            videoStreams.push({ stream, index: i });
            
            logger.debug(`Video stream ${i}:`);
            logger.debug(`  codec_name: ${stream.codec_name || 'unknown'}`);
            logger.debug(`  codec_long_name: ${stream.codec_long_name || 'unknown'}`);
            logger.debug(`  codec_tag_string: ${stream.codec_tag_string || 'unknown'}`);
            logger.debug(`  profile: ${stream.profile || 'unknown'}`);
        }
    }
    
    if (videoStreams.length === 0) {
        logger.warn('No video streams found in file');
        return result;
    }
    
    logger.extended(`Found ${videoStreams.length} video stream(s)`);
    
    // Check each video stream (prioritize first video stream)
    for (let j = 0; j < videoStreams.length; j++) {
        const { stream, index } = videoStreams[j];
        const codecName = (stream.codec_name || '').toLowerCase();
        const codecLongName = (stream.codec_long_name || '').toLowerCase();
        const codecTagString = (stream.codec_tag_string || '').toLowerCase();
        
        logger.extended(`Analyzing video stream ${index} with codec_name: "${codecName}"`);
        
        // Check for AV1
        if (codecName === 'av1' || 
            codecLongName.indexOf('av1') !== -1 || 
            codecTagString === 'av01') {
            
            result.codec = 'av1';
            result.codecName = 'AV1';
            result.confidence = 'high';
            result.detectionMethod = `ffprobe codec detection (stream ${index})`;
            result.analysisDetails.push(`AV1 detected via ${codecName ? 'codec_name' : codecLongName ? 'codec_long_name' : 'codec_tag_string'}`);
            logger.success('*** AV1 CODEC DETECTED ***');
            break;
        }
        
        // Check for VVC/H.266 (multiple possible codec names)
        else if (codecName === 'vvc' || 
                 codecName === 'h266' || 
                 codecName === 'h.266' ||
                 codecName === 'vvenc' ||
                 codecName === 'vvdec' ||
                 codecLongName.indexOf('vvc') !== -1 || 
                 codecLongName.indexOf('h.266') !== -1 || 
                 codecLongName.indexOf('h266') !== -1 ||
                 codecLongName.indexOf('versatile video coding') !== -1) {
            
            result.codec = 'vvc';
            result.codecName = 'VVC/H.266';
            result.confidence = 'high';
            result.detectionMethod = `ffprobe codec detection (stream ${index})`;
            result.analysisDetails.push(`VVC/H.266 detected via ${codecName ? 'codec_name' : 'codec_long_name'}`);
            logger.success('*** VVC/H.266 CODEC DETECTED ***');
            break;
        }
        
        // Check for HEVC/H.265
        else if (codecName === 'hevc' || 
                 codecName === 'h265' || 
                 codecName === 'h.265' ||
                 codecLongName.indexOf('hevc') !== -1 || 
                 codecLongName.indexOf('h.265') !== -1 || 
                 codecLongName.indexOf('h265') !== -1 ||
                 codecTagString === 'hev1' || 
                 codecTagString === 'hvc1') {
            
            result.codec = 'hevc';
            result.codecName = 'HEVC/H.265';
            result.confidence = 'high';
            result.detectionMethod = `ffprobe codec detection (stream ${index})`;
            result.analysisDetails.push(`HEVC/H.265 detected via ${codecName ? 'codec_name' : codecLongName ? 'codec_long_name' : 'codec_tag_string'}`);
            logger.success('*** HEVC/H.265 CODEC DETECTED ***');
            break;
        }
        
        // All other codecs
        else {
            result.codec = 'other';
            result.codecName = `Other (${codecName})`;
            result.detectionMethod = `ffprobe codec detection (stream ${index})`;
            result.analysisDetails.push(`Standard codec: ${codecName}`);
            logger.extended(`Other codec detected: ${codecName}`);
        }
    }
    
    return result;
};

// ===============================================
// HDR DETECTION LOGIC
// ===============================================

const HDRFormats = {
    HDR10_PLUS: {
        name: 'HDR10+',
        output: 3,
        icon: '⚡',
        detectors: [
            {
                field: 'HDR_Format',
                patterns: ['smpte st 2094 app 4', 'st 2094 app 4']
            },
            {
                field: 'HDR_Format_Commercial',
                patterns: ['hdr10+']
            },
            {
                field: 'HDR_Format_String',
                patterns: ['hdr10+', 'st 2094 app 4']
            },
            {
                field: 'HDR_Format_Compatibility',
                patterns: ['hdr10+ profile b', 'hdr10+profile']
            }
        ]
    },
    DOLBY_VISION_P4: {
        name: 'Dolby Vision Profile 4',
        output: 7,
        icon: '🎬',
        detectors: [
            {
                field: 'HDR_Format_Profile',
                patterns: ['dvhe.04', 'profile 4']
            },
            {
                field: 'Codec_Profile',
                patterns: ['dvhe.04', 'profile 4']
            },
            {
                field: 'HDR_Format_Version',
                patterns: ['04.0']
            }
        ]
    },
    DOLBY_VISION_P5: {
        name: 'Dolby Vision Profile 5',
        output: 6,
        icon: '🎬',
        detectors: [
            {
                field: 'HDR_Format_Profile',
                patterns: ['dvhe.05', 'profile 5']
            },
            {
                field: 'Codec_Profile',
                patterns: ['dvhe.05', 'profile 5']
            },
            {
                field: 'HDR_Format_Version',
                patterns: ['05.0']
            }
        ]
    },
    DOLBY_VISION_P7: {
        name: 'Dolby Vision Profile 7',
        output: 5,
        icon: '🎬',
        detectors: [
            {
                field: 'HDR_Format_Profile',
                patterns: ['dvhe.07', 'profile 7']
            },
            {
                field: 'Codec_Profile',
                patterns: ['dvhe.07', 'profile 7']
            },
            {
                field: 'HDR_Format_Version',
                patterns: ['07.0']
            }
        ]
    },
    DOLBY_VISION_P8: {
        name: 'Dolby Vision Profile 8',
        output: 4,
        icon: '🎬',
        detectors: [
            {
                field: 'HDR_Format_Profile',
                patterns: ['dvhe.08', 'profile 8']
            },
            {
                field: 'Codec_Profile',
                patterns: ['dvhe.08', 'profile 8']
            },
            {
                field: 'HDR_Format_Version',
                patterns: ['08.0']
            }
        ]
    }
};

const extractHDRProperties = (track, logger) => {
    const properties = {};
    
    // Debug: show all available fields in this track
    if (logger.level === 'debug') {
        logger.debug('🔍 Available fields in track:');
        let fieldCount = 0;
        for (const key in track) {
            if (track.hasOwnProperty(key) && key !== '@type') {
                fieldCount++;
                if (key.toLowerCase().indexOf('hdr') !== -1 || 
                    key.toLowerCase().indexOf('codec') !== -1 || 
                    key.toLowerCase().indexOf('format') !== -1) {
                    logger.debug(`   📋 ${key}: "${track[key]}"`);
                }
            }
        }
        logger.debug(`   📊 Total fields: ${fieldCount}`);
    }
    
    // Extract all properties, normalize keys for comparison
    for (const key in track) {
        if (track.hasOwnProperty(key) && track[key] && key !== '@type') {
            const normalizedKey = key.replace(/[_\s]/g, '').toLowerCase();
            const value = String(track[key]).toLowerCase();
            properties[normalizedKey] = value;
            
            // Also store with original key for debugging
            properties['_original_' + normalizedKey] = key + ': ' + track[key];
        }
    }
    
    return properties;
};

const detectHDRFormat = (properties, logger) => {
    const formatKeys = ['HDR10_PLUS', 'DOLBY_VISION_P4', 'DOLBY_VISION_P5', 'DOLBY_VISION_P7', 'DOLBY_VISION_P8'];
    
    // Debug: show what properties we're working with
    if (logger.level === 'debug') {
        logger.debug('🔍 Extracted properties for detection:');
        const hdrRelated = [];
        for (const prop in properties) {
            if (prop.indexOf('hdr') !== -1 || prop.indexOf('codec') !== -1 || prop.indexOf('format') !== -1) {
                hdrRelated.push(prop + ': "' + properties[prop] + '"');
            }
        }
        if (hdrRelated.length > 0) {
            logger.debug(`   📋 HDR-related: ${hdrRelated.join(', ')}`);
        } else {
            logger.debug('   ❌ No HDR-related properties found');
        }
    }
    
    // Check each format in priority order
    for (let i = 0; i < formatKeys.length; i++) {
        const formatKey = formatKeys[i];
        const format = HDRFormats[formatKey];
        const matches = [];
        
        logger.debug(`🔍 Checking for ${format.name}...`);
        
        // Check each detector for this format
        for (let j = 0; j < format.detectors.length; j++) {
            const detector = format.detectors[j];
            const normalizedField = detector.field.replace(/[_\s]/g, '').toLowerCase();
            
            // Check if we have this field
            const propertyValue = properties[normalizedField];
            
            if (propertyValue) {
                logger.debug(`   🔍 Found field ${detector.field} = "${propertyValue}"`);
                
                // Check each pattern for this detector
                for (let k = 0; k < detector.patterns.length; k++) {
                    const pattern = detector.patterns[k];
                    if (propertyValue.indexOf(pattern) !== -1) {
                        matches.push(detector.field + ': "' + pattern + '"');
                        logger.debug(`🎯 Match found: ${detector.field} contains "${pattern}"`);
                    }
                }
            } else {
                logger.debug(`   ❌ Field ${detector.field} not found (looking for: ${normalizedField})`);
            }
        }
        
        if (matches.length > 0) {
            logger.success(`${format.icon} ${format.name.toUpperCase()} DETECTED!`);
            logger.extended(`📋 Match details: ${matches.join(', ')}`);
            return {
                format: format,
                matches: matches
            };
        }
    }
    
    logger.extended('📺 No advanced HDR format detected, using standard processing');
    return {
        format: { name: 'Standard HDR/SDR', output: 8, icon: '📺' },
        matches: ['No advanced HDR detected']
    };
};

// ===============================================
// JSON EXPORT FUNCTIONALITY
// ===============================================

const generateOutputPath = (inputPath, mode) => {
    const path = require('path');
    try {
        const dir = path.dirname(inputPath);
        const ext = path.extname(inputPath);
        const baseName = path.basename(inputPath, ext);
        
        const suffix = mode === 'pre' ? '_before' : '_after';
        const outputFileName = `${baseName}${suffix}.json`;
        
        return path.join(dir, outputFileName);
    } catch (error) {
        throw new Error(`Failed to generate output path: ${error.message}`);
    }
};

const exportMediaInfoJSON = (mediaInfoData, filePath, analysisMethod, inputs, logger, args) => {
    if (!inputs.enableJsonExport || !mediaInfoData) {
        logger.debug('📁 JSON export skipped (disabled or no data)');
        return;
    }
    
    try {
        const fs = require('fs');
        const path = require('path');
        
        // GET THE ORIGINAL FILE PATH
        const originalFilePath = args.originalLibraryFile._id || args.inputFileObj.DB._id || filePath;
        logger.info(`📁 Working file path: ${filePath}`);
        logger.info(`📁 Original file path: ${originalFilePath}`);
        
        // Generate output path using ORIGINAL file location
        const outputPath = generateOutputPath(originalFilePath, 'pre');
        
        // Enhanced debugging
        logger.info(`📁 Calculated output path: ${outputPath}`);
        logger.info(`📁 Output directory: ${path.dirname(outputPath)}`);
        
        // Check if directory exists and is writable
        const outputDir = path.dirname(outputPath);
        try {
            fs.accessSync(outputDir, fs.constants.F_OK);
            logger.info(`✅ Output directory exists: ${outputDir}`);
        } catch (dirError) {
            logger.error(`❌ Output directory doesn't exist: ${outputDir}`);
            throw new Error(`Output directory doesn't exist: ${outputDir}`);
        }
        
        try {
            fs.accessSync(outputDir, fs.constants.W_OK);
            logger.info(`✅ Output directory is writable: ${outputDir}`);
        } catch (writeError) {
            logger.error(`❌ Output directory is not writable: ${outputDir}`);
            throw new Error(`No write permission to directory: ${outputDir}`);
        }
        
        // Check if file exists and handle overwrite logic
        if (fs.existsSync(outputPath)) {
            logger.info(`📁 JSON file already exists: ${outputPath}`);
            if (!inputs.forceOverwrite) {
                logger.warn('📁 JSON file exists and overwrite disabled, skipping');
                return;
            }
            logger.extended('🔄 Overwriting existing JSON file');
        }
        
        // Create enriched data structure
        const exportData = {
            metadata: {
                plugin: 'DeNiX Enhanced Video Analysis v3.0',
                generated_at: new Date().toISOString(),
                processing_mode: 'pre',
                source_file: originalFilePath,
                working_file: filePath,
                analysis_method: analysisMethod,
                execution_time_ms: Date.now() - Date.now()
            },
            mediainfo: mediaInfoData
        };
        
        // Add file size from original file if available
        try {
            const stats = fs.statSync(originalFilePath);
            exportData.metadata.file_size_bytes = stats.size;
            logger.info(`📊 Source file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        } catch (statError) {
            logger.warn(`⚠️ Could not get original file size: ${statError.message}`);
            // Try working file as fallback
            try {
                const workingStats = fs.statSync(filePath);
                exportData.metadata.file_size_bytes = workingStats.size;
                logger.info(`📊 Working file size: ${(workingStats.size / 1024 / 1024).toFixed(2)} MB`);
            } catch (workingStatError) {
                logger.warn(`⚠️ Could not get working file size either: ${workingStatError.message}`);
            }
        }
        
        // Write JSON file with detailed error handling
        const jsonContent = JSON.stringify(exportData, null, 2);
        
        try {
            fs.writeFileSync(outputPath, jsonContent, 'utf8');
            logger.info(`✅ JSON file written successfully`);
        } catch (writeError) {
            logger.error(`❌ Failed to write JSON file: ${writeError.message}`);
            throw writeError;
        }
        
        // Verify the file was actually created
        try {
            const verifyStats = fs.statSync(outputPath);
            const fileSizeKB = (verifyStats.size / 1024).toFixed(2);
            logger.success(`✅ JSON exported and verified: ${path.basename(outputPath)} (${fileSizeKB} KB)`);
            logger.info(`📁 Full path: ${outputPath}`);
        } catch (verifyError) {
            logger.error(`❌ JSON file verification failed: ${verifyError.message}`);
            throw new Error(`File was not created successfully: ${verifyError.message}`);
        }
        
    } catch (error) {
        logger.error(`❌ JSON export failed: ${error.message}`);
        logger.error(`📁 Working directory: ${process.cwd()}`);
        logger.error(`📁 User ID: ${process.getuid ? process.getuid() : 'N/A'}`);
        logger.error(`📁 Group ID: ${process.getgid ? process.getgid() : 'N/A'}`);
    }
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
        let performanceTimer = null;
        
        if (args.inputs.showPerformanceMetrics) {
            performanceTimer = createTimer();
        }

        const processingMetrics = {
            mediaInfoTime: 0,
            codecDetectionTime: 0,
            hdrDetectionTime: 0,
            jsonExportTime: 0,
            totalTime: 0
        };

        logger.banner('🎯 ENHANCED VIDEO ANALYSIS v3.0 STARTING');
        logger.section('DeNiX Enhanced Video Analysis: Comprehensive Codec & HDR Detection');
        logger.info(`📁 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`📊 Container: ${args.inputFileObj.container || 'unknown'}`);
        
        // ===============================================
        // STEP 1: PLATFORM DETECTION
        // ===============================================
        
        logger.subsection('Step 1: Platform detection and setup');
        
        const isWindows = process.platform === 'win32';
        const currentPath = isWindows ? args.inputs.mediainfoPathWindows : args.inputs.mediainfoPathLinux;
        
        logger.success(`🖥️ Platform: ${isWindows ? 'Windows' : 'Linux/Unix'}`);
        logger.extended(`MediaInfo path: ${currentPath}`);

        // ===============================================
        // STEP 2: MEDIAINFO DATA ACQUISITION
        // ===============================================
        
        logger.subsection('Step 2: MediaInfo analysis and data acquisition');
        const mediaInfoStartTime = Date.now();
        
        let mediaInfoData = null;
        let analysisMethod = 'unknown';
        
        try {
            // Try MediaInfo CLI first
            try {
                logger.extended('📊 Analyzing with MediaInfo CLI...');
                mediaInfoData = yield runMediaInfoCLI(
                    args.inputFileObj._id, 
                    args.inputs.mediainfoPathLinux, 
                    args.inputs.mediainfoPathWindows
                );
                analysisMethod = 'MediaInfo CLI';
                logger.success('✅ MediaInfo CLI analysis successful');
            } catch (cliError) {
                logger.warn(`⚠️ MediaInfo CLI failed: ${cliError.message}`);
                logger.extended('🔄 Trying FFprobe fallback...');
                mediaInfoData = yield runFFprobeFallback(
                    args.inputFileObj._id,
                    args.inputs.ffprobePathLinux,
                    args.inputs.ffprobePathWindows
                );
                analysisMethod = 'FFprobe (fallback)';
                logger.success('✅ FFprobe fallback analysis successful');
            }
            
            // Validate MediaInfo data structure
            if (!mediaInfoData || !mediaInfoData.media || !mediaInfoData.media.track) {
                throw new Error('Invalid MediaInfo data structure');
            }
            
            const tracks = mediaInfoData.media.track;
            if (!Array.isArray(tracks)) {
                throw new Error('MediaInfo tracks is not an array');
            }
            
            logger.success(`✅ MediaInfo analysis successful: ${tracks.length} tracks found`);
            logger.extended(`Analysis method: ${analysisMethod}`);
            
        } catch (error) {
            logger.error(`❌ MediaInfo analysis completely failed: ${error.message}`);
            logger.warn('⚠️ Proceeding with FFprobe data only');
            analysisMethod = 'Analysis failed - using ffprobe';
            mediaInfoData = null;
        }
        
        processingMetrics.mediaInfoTime = Date.now() - mediaInfoStartTime;

        // ===============================================
        // STEP 3: VIDEO CODEC DETECTION
        // ===============================================
        
        logger.subsection('Step 3: Video codec detection and analysis');
        const codecStartTime = Date.now();
        
        // Check if ffProbeData exists
        if (!args.inputFileObj || !args.inputFileObj.ffProbeData || !args.inputFileObj.ffProbeData.streams) {
            logger.error('❌ No ffProbeData streams found');
            
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 9,
                variables: args.variables,
            };
        }
        
        const streams = args.inputFileObj.ffProbeData.streams;
        logger.extended(`Found ${streams.length} streams in file`);
        
        const codecResult = detectVideoCodec(streams, logger);
        
        processingMetrics.codecDetectionTime = Date.now() - codecStartTime;

        // ===============================================
        // STEP 4: HDR FORMAT DETECTION
        // ===============================================
        
        logger.subsection('Step 4: HDR format detection and analysis');
        const hdrStartTime = Date.now();
        
        let hdrResult = null;
        
        if (mediaInfoData && mediaInfoData.media && mediaInfoData.media.track) {
            const tracks = mediaInfoData.media.track;
            
            // Analyze tracks for HDR
            for (let i = 0; i < tracks.length; i++) {
                const track = tracks[i];
                const trackType = track['@type'] || 'Unknown';
                
                logger.debug(`🔍 Analyzing track ${i} (Type: ${trackType})`);
                
                const properties = extractHDRProperties(track, logger);
                
                if (logger.level === 'debug' && Object.keys(properties).length > 0) {
                    logger.debug('📋 Extracted HDR properties:');
                    for (const prop in properties) {
                        if (properties[prop] && !prop.startsWith('_original_')) {
                            logger.debug(`   ${prop}: "${properties[prop]}"`);
                        }
                    }
                }
                
                // Detect HDR format - continue checking all tracks, don't break early
                const currentResult = detectHDRFormat(properties, logger);
                
                // If we found an advanced HDR format (not output 8), use it and stop
                if (currentResult.format.output !== 8) {
                    hdrResult = currentResult;
                    logger.success(`🎯 HDR format detected in track ${i}, stopping analysis`);
                    break;
                }
            }
        } else {
            logger.warn('⚠️ No MediaInfo data available for HDR detection');
        }
        
        // If no advanced HDR found, default to standard processing
        if (!hdrResult) {
            hdrResult = {
                format: { name: 'Standard HDR/SDR', output: 8, icon: '📺' },
                matches: ['No MediaInfo data or advanced HDR detected']
            };
        }
        
        processingMetrics.hdrDetectionTime = Date.now() - hdrStartTime;

        // ===============================================
        // STEP 5: JSON EXPORT
        // ===============================================
        
        logger.subsection('Step 5: MediaInfo JSON export');
        const jsonStartTime = Date.now();
        
        if (mediaInfoData) {
            exportMediaInfoJSON(
                mediaInfoData, 
                args.inputFileObj._id, 
                analysisMethod, 
                args.inputs, 
                logger,
                args
            );
        } else {
            logger.warn('⚠️ No MediaInfo data to export');
        }
        
        processingMetrics.jsonExportTime = Date.now() - jsonStartTime;

        // ===============================================
        // STEP 6: ROUTING DECISION
        // ===============================================
        
        logger.subsection('Step 6: Routing decision and final results');
        
        let finalOutput = 8; // Default to standard processing
        let finalReason = 'Standard codec and HDR format';
        let finalIcon = '📺';
        
        // Priority: Codec detection first, then HDR detection
        if (codecResult.codec === 'av1') {
            finalOutput = 1;
            finalReason = `AV1 codec detected (${codecResult.detectionMethod})`;
            finalIcon = '🚀';
        } else if (codecResult.codec === 'vvc') {
            finalOutput = 2;
            finalReason = `VVC/H.266 codec detected (${codecResult.detectionMethod})`;
            finalIcon = '🔮';
        } else if (hdrResult.format.output !== 8) {
            // Advanced HDR format detected
            finalOutput = hdrResult.format.output;
            finalReason = `${hdrResult.format.name} detected`;
            finalIcon = hdrResult.format.icon;
        }
        
        processingMetrics.totalTime = Date.now() - startTime;

        // ===============================================
        // STEP 7: FINAL SUMMARY AND REPORTING
        // ===============================================
        
        logger.banner('🎯 FINAL ANALYSIS RESULTS');
        
        logger.success(`${finalIcon} Final routing: Output ${finalOutput}`);
        logger.success(`🎯 Reason: ${finalReason}`);
        logger.extended(`🎬 Detected codec: ${codecResult.codecName}`);
        logger.extended(`🌈 HDR format: ${hdrResult.format.name}`);
        logger.extended(`📊 Analysis method: ${analysisMethod}`);
        
        // Performance metrics
        if (args.inputs.showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ MediaInfo analysis: ${processingMetrics.mediaInfoTime}ms`);
            logger.extended(`⏱️ Codec detection: ${processingMetrics.codecDetectionTime}ms`);
            logger.extended(`⏱️ HDR detection: ${processingMetrics.hdrDetectionTime}ms`);
            logger.extended(`⏱️ JSON export: ${processingMetrics.jsonExportTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            const efficiency = totalTime > 0 ? Math.round((streams.length / totalTime) * 1000) : 0;
            logger.extended(`📈 Processing efficiency: ${efficiency} streams/second`);
        }

        // Feature utilization summary
        if (args.inputs.logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'MediaInfo integration', enabled: mediaInfoData !== null },
                { name: 'JSON export', enabled: args.inputs.enableJsonExport },
                { name: 'Debug logging', enabled: args.inputs.debugMode },
                { name: 'Performance metrics', enabled: args.inputs.showPerformanceMetrics },
                { name: 'Force overwrite', enabled: args.inputs.forceOverwrite }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`📁 Codec detection method: ${codecResult.detectionMethod}`);
            logger.debug(`📁 HDR matches: ${hdrResult.matches.length}`);
            logger.debug(`📊 Total streams analyzed: ${streams.length}`);
        }

        // Enhanced variables with comprehensive information
        const updatedVariables = {
            ...args.variables,
            
            // Video codec information
            detectedVideoCodec: codecResult.codecName,
            videoCodecConfidence: codecResult.confidence,
            videoCodecMethod: codecResult.detectionMethod,
            
            // HDR information
            detectedHDRFormat: hdrResult.format.name,
            hdrFormatOutput: hdrResult.format.output,
            hdrMatches: hdrResult.matches.join(', '),
            
            // Analysis metadata
            analysisMethod: analysisMethod,
            platform: isWindows ? 'Windows' : 'Linux/Unix',
            processingTime: processingMetrics.totalTime,
            
            // Plugin metadata
            videoAnalysisVersion: '3.0',
            videoAnalysisTimestamp: new Date().toISOString()
        };

        logger.success('✅ Enhanced Video Analysis complete!');
        logger.info(`🎯 Final result: ${finalReason} → Output ${finalOutput}`);
        logger.banner('🚀 READY TO PROCEED WITH SPECIALIZED PROCESSING');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
            outputNumber: finalOutput,
            variables: updatedVariables,
        };

    } catch (error) {
        const logger = new Logger('info');
        logger.error(`Plugin execution failed: ${error.message}`);
        if (error.stack && args.inputs && args.inputs.logging_level === 'debug') {
            logger.debug(`Stack trace: ${error.stack}`);
        }
        args.jobLog(logger.getOutput());
        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 9,
            variables: args.variables,
        };
    }
});

exports.plugin = plugin;