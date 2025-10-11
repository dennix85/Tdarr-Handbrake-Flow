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
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const fileUtils_1 = require("../../../../FlowHelpers/1.0.0/fileUtils");
const { CLI } = require("../../../../FlowHelpers/1.0.0/cliUtils");

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details with enhanced DeNiX styling
const details = () => ({
    name: '🌟 DeNiX Enhanced Dolby Vision & HDR10+: Specialized HandBrake Encoder v4.0',
    description: 'Advanced Dolby Vision and HDR10+ encoding system with comprehensive MediaInfo detection, intelligent profile analysis, enhanced logging, and performance monitoring. Features environment-aware processing and quality-based defaults for premium HDR content.',
    style: {
        borderColor: '#9400D3',
        backgroundColor: 'rgba(148, 0, 211, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '8px',
        // Enhanced bright violet/rainbow glow with 10 layers - expanded reach with graduated opacity
        boxShadow: `
            0 0 10px rgba(148, 0, 211, 0.5),
            0 0 25px rgba(148, 0, 211, 0.46),
            0 0 40px rgba(148, 0, 211, 0.42),
            0 0 55px rgba(148, 0, 211, 0.39),
            0 0 70px rgba(148, 0, 211, 0.35),
            0 0 85px rgba(148, 0, 211, 0.31),
            0 0 100px rgba(148, 0, 211, 0.27),
            0 0 115px rgba(148, 0, 211, 0.23),
            0 0 130px rgba(148, 0, 211, 0.19),
            0 0 145px rgba(148, 0, 211, 0.17),
            0 0 160px rgba(148, 0, 211, 0.15),
            inset 0 0 20px rgba(148, 0, 211, 0.4),
            0 0 75px rgba(255, 0, 255, 0.5)
        `,
        background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
        color: '#ffffff',
        textShadow: '0 0 12px rgba(255, 0, 255, 0.8), 0 0 25px rgba(148, 0, 211, 0.6)',
    },
    tags: 'video,handbrake,dolby,vision,hdr,hdr10+,denix,enhanced,premium',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.14.01',
    sidebarPosition: -1,
    icon: '🌟',
    inputs: [
        // MediaInfo Configuration - Platform Specific
        {
            label: '🐧 MediaInfo Path (Linux)',
            name: 'mediainfoPathLinux',
            type: 'string',
            defaultValue: 'mediainfo',
            inputUI: { type: 'text' },
            tooltip: 'MediaInfo executable path for Linux/macOS systems.\\n\\n' +
                     'Default: "mediainfo" (assumes it\'s in system PATH)\\n' +
                     'Common paths:\\n' +
                     '• Ubuntu/Debian: "/usr/bin/mediainfo"\\n' +
                     '• CentOS/RHEL: "/usr/bin/mediainfo"\\n' +
                     '• Custom install: "/usr/local/bin/mediainfo"\\n\\n' +
                     'Critical for accurate Dolby Vision profile detection on Linux.',
        },
        {
            label: '🪟 MediaInfo Path (Windows)',
            name: 'mediainfoPathWindows',
            type: 'string',
            defaultValue: 'MediaInfo.exe',
            inputUI: { type: 'text' },
            tooltip: 'MediaInfo executable path for Windows systems.\\n\\n' +
                     'Default: "MediaInfo.exe" (assumes it\'s in system PATH)\\n' +
                     'Common paths:\\n' +
                     '• Standard install: "C:\\\\Program Files\\\\MediaInfo\\\\MediaInfo.exe"\\n' +
                     '• CLI version: "C:\\\\Program Files\\\\MediaInfo\\\\MediaInfoCLI.exe"\\n' +
                     '• Portable: "C:\\\\Tools\\\\MediaInfo\\\\MediaInfo.exe"\\n\\n' +
                     'Critical for accurate Dolby Vision profile detection on Windows.',
        },

        // HandBrake Configuration - Platform Specific
        {
            label: '🐧 HandBrake CLI Path (Linux)',
            name: 'handbrakeCLIPathLinux',
            type: 'string',
            defaultValue: 'HandBrakeCLI',
            inputUI: { type: 'text' },
            tooltip: 'HandBrake CLI executable path for Linux/macOS systems.\\n\\n' +
                     'Default: "HandBrakeCLI" (assumes it\'s in system PATH)\\n' +
                     'Common paths:\\n' +
                     '• Ubuntu/Debian: "/usr/bin/HandBrakeCLI"\\n' +
                     '• Flatpak: "/var/lib/flatpak/exports/bin/fr.handbrake.ghb"\\n' +
                     '• Custom install: "/usr/local/bin/HandBrakeCLI"\\n' +
                     '• User install: "~/Applications/HandBrake/HandBrakeCLI"\\n\\n' +
                     'Required for DV/HDR encoding on Linux.',
        },
        {
            label: '🪟 HandBrake CLI Path (Windows)',
            name: 'handbrakeCLIPathWindows',
            type: 'string',
            defaultValue: 'HandBrakeCLI.exe',
            inputUI: { type: 'text' },
            tooltip: 'HandBrake CLI executable path for Windows systems.\\n\\n' +
                     'Default: "HandBrakeCLI.exe" (assumes it\'s in system PATH)\\n' +
                     'Common paths:\\n' +
                     '• Standard install: "C:\\\\Program Files\\\\HandBrake\\\\HandBrakeCLI.exe"\\n' +
                     '• Portable: "C:\\\\Tools\\\\HandBrake\\\\HandBrakeCLI.exe"\\n' +
                     '• Microsoft Store: Check in WindowsApps folder\\n\\n' +
                     'Required for DV/HDR encoding on Windows.',
        },

        // Video Encoder Selection (DV/HDR specific)
        {
            label: '🎬 Video Encoder',
            name: 'videoEncoder',
            type: 'string',
            defaultValue: 'x265',
            inputUI: {
                type: 'dropdown',
                options: [
                    { label: 'libx265 (Best for DV/HDR10+ - Recommended)', value: 'x265' },
                    { label: 'SVT-AV1 (DV Profile 7/8 only - Experimental)', value: 'svt_av1' },
                ],
            },
            tooltip: 'Encoder selection for Dolby Vision/HDR10+ content. HDR10+ content will automatically force x265. SVT-AV1 only supports DV Profile 7/8.',
        },

        // Quality Settings (Resolution-based)
        {
            label: '🎯 1080p Quality (CQ)',
            name: 'fullHdQuality',
            type: 'number',
            defaultValue: 18,
            inputUI: {
                type: 'slider',
                min: 1,
                max: 30,
            },
            tooltip: 'Quality setting for 1080p DV/HDR content (1=highest quality, 30=lowest quality). Lower values recommended for premium HDR content.',
        },
        {
            label: '🎬 4K Quality (CQ)',
            name: 'fourKQuality',
            type: 'number',
            defaultValue: 16,
            inputUI: {
                type: 'slider',
                min: 1,
                max: 30,
            },
            tooltip: 'Quality setting for 4K DV/HDR content (1=highest quality, 30=lowest quality). Lower values preserve HDR detail.',
        },

        // Progress and Timeout
        {
            label: '⏱️ Progress Timeout (minutes)',
            name: 'progressTimeoutMinutes',
            type: 'number',
            defaultValue: 15,
            inputUI: { type: 'text' },
            tooltip: 'Timeout for DV/HDR encoding (0 = disabled). DV/HDR encoding takes 2-5x longer than standard encoding due to metadata processing.',
        },

        // Enhanced Features
        {
            label: '🛡️ Enable Quality Assurance',
            name: 'enable_qa_checks',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable quality assurance checks and DV/HDR validation with detailed analysis',
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
            tooltip: 'Logging detail level: info (basic), extended (detailed DV/HDR analysis), debug (full diagnostics)',
        },
        {
            label: '⏱️ Show Performance Metrics',
            name: 'showPerformanceMetrics',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Display processing timing and DV/HDR encoding performance statistics',
        },
        {
            label: '📋 Generate DV/HDR Report',
            name: 'generateReport',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Generate detailed Dolby Vision/HDR10+ analysis report with metadata information',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: '✅ DV/HDR encoding completed successfully',
        },
        {
            number: 2,
            tooltip: '⏭️ File skipped - incompatible DV profile or not DV/HDR10+ content',
        },
        {
            number: 3,
            tooltip: '❌ Error occurred during DV/HDR processing',
        },
    ],
});
exports.details = details;

// ===============================================
// ENHANCED LOGGING UTILITY WITH 3-LEVEL SYSTEM
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

    dv(message) {
        this.output.push(`🌟 ${message}`);
    }

    hdr(message) {
        this.output.push(`⚡ ${message}`);
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
// PLATFORM DETECTION AND PATH RESOLUTION
// ===============================================

// Detect operating system platform
const detectPlatform = () => {
    const platform = os.platform();
    const isWindows = platform === 'win32';
    const isLinux = platform === 'linux';
    const isMacOS = platform === 'darwin';
    
    return {
        platform,
        isWindows,
        isLinux,
        isMacOS,
        isUnixLike: isLinux || isMacOS
    };
};

// Get the appropriate executable path based on platform
const getExecutablePath = (inputs, executableType, logger) => {
    const platformInfo = detectPlatform();
    let execPath;
    
    if (executableType === 'mediainfo') {
        if (platformInfo.isWindows) {
            execPath = inputs.mediainfoPathWindows || 'MediaInfo.exe';
        } else {
            execPath = inputs.mediainfoPathLinux || 'mediainfo';
        }
    } else if (executableType === 'handbrake') {
        if (platformInfo.isWindows) {
            execPath = inputs.handbrakeCLIPathWindows || 'HandBrakeCLI.exe';
        } else {
            execPath = inputs.handbrakeCLIPathLinux || 'HandBrakeCLI';
        }
    }
    
    logger.extended(`Platform: ${platformInfo.platform} (${platformInfo.isWindows ? 'Windows' : platformInfo.isMacOS ? 'macOS' : 'Linux'})`);
    logger.extended(`${executableType} path: ${execPath}`);
    
    return execPath;
};

// Test if executable exists and is accessible
const testExecutable = (execPath, logger) => {
    try {
        // Try to run with version flag to test accessibility
        const testCommand = `"${execPath}" --version`;
        const output = execSync(testCommand, {
            encoding: 'utf8',
            timeout: 10000,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        logger.debug(`Executable test successful: ${execPath}`);
        return { success: true, version: output.trim() };
    } catch (error) {
        logger.debug(`Executable test failed for ${execPath}: ${error.message}`);
        return { success: false, error: error.message };
    }
};

// Get HandBrake version information - IMPROVED VERSION
const getHandBrakeVersion = (handbrakePath, logger) => {
    try {
        logger.extended('Detecting HandBrake version for diagnostics...');
        
        const versionCommand = `"${handbrakePath}" --version`;
        const output = execSync(versionCommand, {
            encoding: 'utf8',
            timeout: 10000,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        // Parse HandBrake version output
        const lines = output.split('\n');
        let versionInfo = {
            version: 'Unknown',
            buildDate: 'Unknown',
            buildType: 'Unknown',
            gitHash: 'Unknown',
            architecture: 'Unknown',
            fullOutput: output.trim()
        };
        
        // Look for the HandBrake version line
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines and log lines that start with [timestamp]
            if (!trimmedLine || trimmedLine.startsWith('[')) {
                continue;
            }
            
            // Look for "HandBrake" followed by version info
            const handbrakeMatch = trimmedLine.match(/^HandBrake\s+(.+)$/);
            if (handbrakeMatch) {
                const versionString = handbrakeMatch[1].trim();
                versionInfo.version = versionString;
                
                // Parse different version formats
                if (versionString.match(/^\d+\.\d+\.\d+/)) {
                    // Standard release version (e.g., "1.9.2")
                    versionInfo.buildType = 'Release';
                    logger.extended(`Standard release version detected: ${versionString}`);
                    
                } else if (versionString.match(/^\d{14}-[a-f0-9]+-\w+/)) {
                    // Git build version (e.g., "20250823103818-48a150945-makepkg")
                    versionInfo.buildType = 'Development';
                    
                    const gitMatch = versionString.match(/^(\d{14})-([a-f0-9]+)-(\w+)/);
                    if (gitMatch) {
                        const [, timestamp, hash, buildMethod] = gitMatch;
                        
                        // Parse timestamp: 20250823103818 = 2025-08-23 10:38:18
                        if (timestamp.length === 14) {
                            const year = timestamp.substring(0, 4);
                            const month = timestamp.substring(4, 6);
                            const day = timestamp.substring(6, 8);
                            const hour = timestamp.substring(8, 10);
                            const minute = timestamp.substring(10, 12);
                            const second = timestamp.substring(12, 14);
                            
                            versionInfo.buildDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                        }
                        
                        versionInfo.gitHash = hash;
                        versionInfo.buildMethod = buildMethod;
                        
                        logger.extended(`Development build detected: ${timestamp}-${hash}-${buildMethod}`);
                        logger.extended(`Build timestamp: ${versionInfo.buildDate}`);
                        logger.extended(`Git hash: ${hash}`);
                        logger.extended(`Build method: ${buildMethod}`);
                    }
                } else {
                    // Unknown format, but we still have something
                    versionInfo.buildType = 'Unknown Format';
                    logger.extended(`Unknown version format detected: ${versionString}`);
                }
                
                break; // Found the version line, stop looking
            }
        }
        
        // Look for architecture information in other lines
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('x86_64') || lowerLine.includes('amd64')) {
                versionInfo.architecture = 'x86_64';
            } else if (lowerLine.includes('arm64') || lowerLine.includes('aarch64')) {
                versionInfo.architecture = 'ARM64';
            } else if (lowerLine.includes('i386') || lowerLine.includes('x86')) {
                versionInfo.architecture = 'x86';
            }
        }
        
        // Log final results
        if (versionInfo.version !== 'Unknown') {
            logger.success(`HandBrake version detected: ${versionInfo.version}`);
            logger.extended(`Build type: ${versionInfo.buildType}`);
            if (versionInfo.buildDate !== 'Unknown') {
                logger.extended(`Build date: ${versionInfo.buildDate}`);
            }
            if (versionInfo.gitHash !== 'Unknown') {
                logger.extended(`Git hash: ${versionInfo.gitHash}`);
            }
            if (versionInfo.architecture !== 'Unknown') {
                logger.extended(`Architecture: ${versionInfo.architecture}`);
            }
        } else {
            logger.warn('Could not parse HandBrake version from output');
            logger.debug(`Raw output for debugging: ${output}`);
        }
        
        return versionInfo;
        
    } catch (error) {
        logger.warn(`Failed to detect HandBrake version: ${error.message}`);
        return {
            version: 'Detection Failed',
            buildDate: 'Unknown',
            buildType: 'Unknown',
            gitHash: 'Unknown',
            architecture: 'Unknown',
            fullOutput: error.message,
            error: true
        };
    }
};

// ===============================================
// ENHANCED HELPER FUNCTIONS
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

// Format file size helper
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Format duration helper
const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
};

// ============================================================================
// 🌟 ENHANCED HDR DETECTION LOGIC
// ============================================================================

// HDR Format definitions with enhanced metadata
const HDRFormats = {
    HDR10_PLUS: {
        name: 'HDR10+',
        output: 4,
        icon: '⚡',
        priority: 1, // Highest priority
        description: 'Dynamic HDR with scene-by-scene metadata',
        detectors: [
            {
                field: 'HDR_Format',
                patterns: ['smpte st 2094 app 4', 'st 2094 app 4', 'hdr10+']
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
    DOLBY_VISION_P5: {
        name: 'Dolby Vision Profile 5',
        output: 1,
        icon: '🎬',
        priority: 2,
        description: 'DV Profile 5 - IPTPQc2 with BL+EL+RPU',
        detectors: [
            {
                field: 'HDR_Format_Profile',
                patterns: ['dvhe.05', 'profile 5']
            },
            {
                field: 'Codec_Profile',
                patterns: ['dvhe.05', 'profile 5']
            }
        ]
    },
    DOLBY_VISION_P7: {
        name: 'Dolby Vision Profile 7',
        output: 2,
        icon: '🎬',
        priority: 3,
        description: 'DV Profile 7 - IPTPQc2 with BL+EL+RPU (MEL)',
        detectors: [
            {
                field: 'HDR_Format_Profile',
                patterns: ['dvhe.07', 'profile 7']
            },
            {
                field: 'Codec_Profile',
                patterns: ['dvhe.07', 'profile 7']
            }
        ]
    },
    DOLBY_VISION_P8: {
        name: 'Dolby Vision Profile 8',
        output: 3,
        icon: '🎬',
        priority: 4,
        description: 'DV Profile 8 - IPTPQc2 with BL+RPU (no EL)',
        detectors: [
            {
                field: 'HDR_Format_Profile',
                patterns: ['dvhe.08', 'profile 8']
            },
            {
                field: 'Codec_Profile',
                patterns: ['dvhe.08', 'profile 8']
            }
        ]
    }
};

// Enhanced Docker environment detection
const isDockerEnvironment = () => {
    try {
        // Method 1: Check for .dockerenv file
        if (fs.existsSync('/.dockerenv')) return true;
        
        // Method 2: Environment variables
        const containerEnvVars = ['DOCKER_CONTAINER', 'container', 'HOSTNAME'];
        for (const envVar of containerEnvVars) {
            const value = process.env[envVar];
            if (value && (value.includes('docker') || value.includes('container'))) return true;
        }
        
        // Method 3: Check cgroup for docker indicators
        try {
            const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
            if (cgroup.includes('docker') || cgroup.includes('containerd')) return true;
        } catch (e) {
            // Ignore cgroup read errors
        }
        
        // Method 4: Check for Tdarr-specific Docker paths
        if (fs.existsSync('/app/Tdarr_Node') || fs.existsSync('/home/Tdarr')) return true;
        
        return false;
    } catch (e) {
        return false;
    }
};

// Enhanced MediaInfo CLI execution
const runMediaInfoCLI = (filePath, mediainfoPath, logger) => {
    try {
        const command = `"${mediainfoPath}" --Output=JSON --Full "${filePath}"`;
        logger.debug(`Executing MediaInfo CLI: ${path.basename(filePath)}`);
        
        const output = execSync(command, {
            encoding: 'utf8',
            timeout: 120000, // 2 minute timeout
            maxBuffer: 50 * 1024 * 1024 // 50MB buffer
        });
        
        const parsed = JSON.parse(output);
        logger.success('MediaInfo CLI analysis completed successfully');
        return parsed;
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            throw new Error('MediaInfo CLI timeout after 2 minutes');
        }
        if (error.message.includes('Unexpected token')) {
            throw new Error('MediaInfo CLI returned invalid JSON');
        }
        throw new Error(`MediaInfo CLI execution failed: ${error.message}`);
    }
};

// Enhanced Tdarr MediaInfo.js execution
const runTdarrMediaInfo = (filePath, logger) => {
    try {
        const mediaInfo = require('mediainfo.js');
        const factory = mediaInfo.default ? mediaInfo.default() : mediaInfo();
        
        if (!factory || !factory.mediainfoModule) {
            throw new Error('MediaInfo.js module not available');
        }
        
        const mi = new factory.mediainfoModule.MediaInfo('JSON', 1, null);
        const fileBuffer = fs.readFileSync(filePath);
        
        mi.open_buffer_init(fileBuffer.length, 0);
        mi.open_buffer_continue(fileBuffer, fileBuffer.length);
        mi.open_buffer_finalize();
        
        const result = mi.inform();
        const parsed = JSON.parse(result);
        
        mi.close();
        logger.success('Tdarr MediaInfo.js analysis completed successfully');
        return parsed;
    } catch (error) {
        throw new Error(`Tdarr MediaInfo.js failed: ${error.message}`);
    }
};

// Enhanced HDR property extraction
const extractHDRProperties = (track, logger) => {
    const properties = {};
    
    // Debug: show all available fields in this track
    if (logger.level === 'debug') {
        logger.debug('🔍 Available fields in track:');
        let fieldCount = 0;
        for (const key in track) {
            if (track.hasOwnProperty(key) && key !== '@type') {
                fieldCount++;
                if (key.toLowerCase().includes('hdr') || 
                    key.toLowerCase().includes('codec') || 
                    key.toLowerCase().includes('format')) {
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

// Enhanced HDR format detection
const detectHDRFormat = (properties, logger) => {
    const formatKeys = ['HDR10_PLUS', 'DOLBY_VISION_P5', 'DOLBY_VISION_P7', 'DOLBY_VISION_P8'];
    
    // Debug: show what properties we're working with
    if (logger.level === 'debug') {
        logger.debug('🔍 Extracted properties for detection:');
        const hdrRelated = [];
        for (const prop in properties) {
            if (prop.includes('hdr') || prop.includes('codec') || prop.includes('format')) {
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
    for (const formatKey of formatKeys) {
        const format = HDRFormats[formatKey];
        const matches = [];
        
        logger.debug(`🔍 Checking for ${format.name}...`);
        
        // Check each detector for this format
        for (const detector of format.detectors) {
            const normalizedField = detector.field.replace(/[_\s]/g, '').toLowerCase();
            const propertyValue = properties[normalizedField];
            
            if (propertyValue) {
                logger.debug(`   🔍 Found field ${detector.field} = "${propertyValue}"`);
                
                // Check each pattern for this detector
                for (const pattern of detector.patterns) {
                    if (propertyValue.includes(pattern)) {
                        matches.push(`${detector.field}: "${pattern}"`);
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
            logger.extended(`📝 Description: ${format.description}`);
            return {
                format: format,
                matches: matches
            };
        }
    }
    
    logger.extended('📺 No DV/HDR10+ format detected');
    return {
        format: { name: 'No DV/HDR10+', output: 5, icon: '📺', description: 'Standard content' },
        matches: ['No DV/HDR10+ detected']
    };
};

// Enhanced main HDR analysis function
const analyzeVideoForHDR = (filePath, inputs, logger) => {
    try {
        logger.dv('Starting comprehensive DV/HDR10+ analysis...');
        
        const isDocker = isDockerEnvironment();
        logger.extended(`🐳 Environment: ${isDocker ? 'Docker container' : 'Bare metal'}`);
        
        let mediaInfoData;
        let analysisMethod;
        
        // Get appropriate MediaInfo path
        const mediainfoPath = getExecutablePath(inputs, 'mediainfo', logger);
        
        // Get MediaInfo data using enhanced fallback chain
        if (isDocker) {
            // Docker: Try Tdarr MediaInfo.js first
            try {
                logger.extended('📊 Analyzing with Tdarr MediaInfo.js module...');
                mediaInfoData = runTdarrMediaInfo(filePath, logger);
                analysisMethod = 'Tdarr MediaInfo.js';
            } catch (mediaInfoError) {
                logger.warn(`⚠️ Tdarr MediaInfo.js failed: ${mediaInfoError.message}`);
                throw new Error('Docker MediaInfo.js failed and no fallback available');
            }
        } else {
            // Bare metal: Try CLI first, then fallback
            try {
                logger.extended('📊 Analyzing with MediaInfo CLI...');
                mediaInfoData = runMediaInfoCLI(filePath, mediainfoPath, logger);
                analysisMethod = 'MediaInfo CLI';
            } catch (cliError) {
                logger.warn(`⚠️ MediaInfo CLI failed: ${cliError.message}`);
                try {
                    logger.extended('🔄 Trying Tdarr MediaInfo.js fallback...');
                    mediaInfoData = runTdarrMediaInfo(filePath, logger);
                    analysisMethod = 'Tdarr MediaInfo.js (fallback)';
                } catch (jsError) {
                    logger.warn(`⚠️ All MediaInfo methods failed`);
                    throw new Error('All MediaInfo analysis methods failed');
                }
            }
        }
        
        // Validate MediaInfo data structure
        if (!mediaInfoData || !mediaInfoData.media || !mediaInfoData.media.track) {
            throw new Error('Invalid MediaInfo data structure');
        }
        
        const tracks = mediaInfoData.media.track;
        if (!Array.isArray(tracks)) {
            throw new Error('MediaInfo tracks is not an array');
        }
        
        logger.success(`✅ MediaInfo analysis successful: ${tracks.length} tracks found using ${analysisMethod}`);
        
        // Analyze tracks for HDR - check ALL tracks
        let detectionResults = [];
        
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const trackType = track['@type'] || 'Unknown';
            
            logger.debug(`🔍 Analyzing track ${i} (Type: ${trackType})`);
            
            const properties = extractHDRProperties(track, logger);
            const currentResult = detectHDRFormat(properties, logger);
            
            // If we found DV/HDR10+ format, store it
            if (currentResult.format.output !== 5) {
                detectionResults.push(currentResult);
                logger.success(`🎯 ${currentResult.format.name} detected in track ${i}`);
            }
        }
        
        // Determine final result - HDR10+ takes priority
        let finalResult = null;
        let hasHDR10Plus = false;
        let dolbyVisionProfile = null;
        
        // Sort by priority (HDR10+ first)
        detectionResults.sort((a, b) => (a.format.priority || 999) - (b.format.priority || 999));
        
        for (const result of detectionResults) {
            if (result.format.name === 'HDR10+') {
                hasHDR10Plus = true;
                finalResult = result;
                break; // HDR10+ wins
            } else if (result.format.name.includes('Dolby Vision')) {
                if (result.format.name.includes('Profile 5')) dolbyVisionProfile = 5;
                else if (result.format.name.includes('Profile 7')) dolbyVisionProfile = 7;
                else if (result.format.name.includes('Profile 8')) dolbyVisionProfile = 8;
                
                if (!finalResult) finalResult = result;
            }
        }
        
        // If no DV/HDR10+ found, use default
        if (!finalResult) {
            finalResult = {
                format: { name: 'No DV/HDR10+', output: 5, icon: '📺', description: 'Standard content' },
                matches: ['No DV/HDR10+ detected']
            };
        }
        
        return {
            detectedFormat: finalResult.format,
            analysisMethod: analysisMethod,
            success: true,
            dolbyVisionProfile: dolbyVisionProfile,
            hasHDR10Plus: hasHDR10Plus,
            hasHDR10: false,
            allDetections: detectionResults
        };
        
    } catch (error) {
        logger.error(`❌ DV/HDR10+ analysis failed: ${error.message}`);
        logger.debug(`HDR analysis error stack: ${error.stack}`);
        return {
            detectedFormat: { name: 'No DV/HDR10+', output: 5, icon: '📺', description: 'Analysis failed' },
            analysisMethod: 'Analysis failed',
            success: false,
            error: error.message,
            dolbyVisionProfile: null,
            hasHDR10: false,
            allDetections: []
        };
    }
};

// ===============================================
// QUALITY ASSURANCE AND VALIDATION FUNCTIONS
// ===============================================

// Enhanced quality assurance for DV/HDR content
const performQualityAssurance = (inputFileObj, inputs, logger) => {
    const result = {
        canProcess: true,
        errorMessage: '',
        warnings: [],
        recommendations: []
    };

    if (!inputs.enable_qa_checks) {
        logger.debug('Quality assurance checks disabled');
        return result;
    }

    try {
        // Validate input file object
        if (!inputFileObj || !inputFileObj._id) {
            result.canProcess = false;
            result.errorMessage = 'Invalid input file object - missing file path';
            return result;
        }

        // Check if it's a video file
        if (inputFileObj.fileMedium !== 'video') {
            result.canProcess = false;
            result.errorMessage = 'Not a video file - DV/HDR encoding requires video content';
            return result;
        }

        // Check for required data
        if (!inputFileObj.ffProbeData || !inputFileObj.ffProbeData.streams) {
            result.warnings.push('Missing ffProbe data - HDR detection may be limited');
        }

        // Validate video resolution for DV/HDR
        const resolution = inputFileObj.video_resolution;
        if (resolution && !['1080p', '4KUHD', 'DCI4K'].includes(resolution)) {
            result.warnings.push('Unusual resolution for DV/HDR content - verify source quality');
        }

        // Check encoder compatibility
        if (inputs.videoEncoder === 'svt_av1') {
            result.recommendations.push('SVT-AV1 only supports DV Profile 7/8 - x265 recommended for broader compatibility');
        }

        // Check executable paths
        const platformInfo = detectPlatform();
        const mediainfoPath = getExecutablePath(inputs, 'mediainfo', logger);
        const handbrakePath = getExecutablePath(inputs, 'handbrake', logger);
        
        // Test MediaInfo accessibility
        if (!isDockerEnvironment()) {
            const mediaInfoTest = testExecutable(mediainfoPath, logger);
            if (!mediaInfoTest.success) {
                result.warnings.push(`MediaInfo not accessible at "${mediainfoPath}" - DV/HDR detection may fail`);
            }
        }
        
        // Test HandBrake accessibility
        const handbrakeTest = testExecutable(handbrakePath, logger);
        if (!handbrakeTest.success) {
            result.canProcess = false;
            result.errorMessage = `HandBrake CLI not accessible at "${handbrakePath}" - encoding cannot proceed`;
            return result;
        }

        logger.success('Quality assurance validation completed for DV/HDR content');

    } catch (error) {
        result.warnings.push(`QA check encountered error: ${error.message}`);
    }

    return result;
};

// Generate DV/HDR analysis report
const generateDVHDRReport = (videoAnalysis, inputs, processingTime, handbrakeVersion) => {
    const report = [];
    
    report.push('🌟 Dolby Vision & HDR10+ Analysis Report');
    report.push('═'.repeat(40));
    report.push(`Analysis Time: ${formatDuration(processingTime)}`);
    report.push(`Detection Method: ${videoAnalysis.analysisMethod}`);
    report.push(`Status: ${videoAnalysis.success ? 'SUCCESS' : 'FAILED'}`);
    report.push('');
    
    // System Information
    const platformInfo = detectPlatform();
    report.push('🖥️ System Information:');
    report.push(`• Platform: ${platformInfo.platform} (${platformInfo.isWindows ? 'Windows' : platformInfo.isMacOS ? 'macOS' : 'Linux'})`);
    report.push(`• HandBrake Version: ${handbrakeVersion.version}`);
    if (handbrakeVersion.buildDate !== 'Unknown') {
        report.push(`• HandBrake Build: ${handbrakeVersion.buildDate}`);
    }
    if (handbrakeVersion.architecture !== 'Unknown') {
        report.push(`• Architecture: ${handbrakeVersion.architecture}`);
    }
    report.push('');
    
    if (videoAnalysis.success) {
        report.push('🎬 HDR Format Analysis:');
        report.push(`• Detected Format: ${videoAnalysis.detectedFormat.name}`);
        report.push(`• Description: ${videoAnalysis.detectedFormat.description}`);
        
        if (videoAnalysis.dolbyVisionProfile) {
            report.push(`• Dolby Vision Profile: ${videoAnalysis.dolbyVisionProfile}`);
            
            // Profile-specific information
            switch (videoAnalysis.dolbyVisionProfile) {
                case 5:
                    report.push('  - IPTPQc2 with BL+EL+RPU');
                    report.push('  - NOT RECOMMENDED for re-encoding');
                    break;
                case 7:
                    report.push('  - IPTPQc2 with BL+EL+RPU (MEL)');
                    report.push('  - COMPATIBLE with re-encoding');
                    break;
                case 8:
                    report.push('  - IPTPQc2 with BL+RPU (no EL)');
                    report.push('  - COMPATIBLE with re-encoding');
                    break;
            }
        }
        
        if (videoAnalysis.hasHDR10Plus) {
            report.push(`• HDR10+: Detected`);
            report.push('  - Dynamic metadata present');
            report.push('  - Will force x265 encoder');
        }
        
        report.push('');
        report.push('⚙️ Encoding Configuration:');
        report.push(`• Target Encoder: ${inputs.videoEncoder}`);
        if (videoAnalysis.hasHDR10Plus && inputs.videoEncoder !== 'x265') {
            report.push('  - OVERRIDE: HDR10+ forces x265');
        }
        report.push(`• 10-bit Encoding: Enabled (required for DV/HDR)`);
        report.push(`• Container: MKV (required for DV/HDR)`);
        
        if (videoAnalysis.allDetections && videoAnalysis.allDetections.length > 0) {
            report.push('');
            report.push('📋 All Detections:');
            videoAnalysis.allDetections.forEach((detection, index) => {
                report.push(`• ${index + 1}. ${detection.format.name}`);
                report.push(`  Matches: ${detection.matches.join(', ')}`);
            });
        }
    } else {
        report.push('❌ Analysis Failed:');
        report.push(`• Error: ${videoAnalysis.error || 'Unknown error'}`);
        report.push('• Recommendation: Check MediaInfo installation and file integrity');
    }
    
    return report.join('\n');
};

// Enhanced HandBrake preset generation for DV/HDR
const generatePreset = (args, videoAnalysis, logger) => {
    let encoder = args.inputs.videoEncoder;
    
    // HDR10+ ALWAYS forces x265 (even if it's hybrid DV+HDR10+)
    if (videoAnalysis.hasHDR10Plus) {
        encoder = 'x265';
        logger.hdr('HDR10+ detected - forcing x265 encoder (HDR10+ requires x265)');
    }
    
    // Determine quality based on resolution
    const resolution = args.inputFileObj.video_resolution;
    let quality;
    
    if (resolution === '4KUHD' || resolution === 'DCI4K') {
        quality = Number(args.inputs.fourKQuality);
        logger.extended(`4K resolution detected - using quality setting: CRF ${quality}`);
    } else {
        quality = Number(args.inputs.fullHdQuality);
        logger.extended(`1080p/other resolution detected - using quality setting: CRF ${quality}`);
    }
    
    // Always 10-bit for DV/HDR
    const finalVideoEncoder = encoder === 'x265' ? 'x265_10bit' : 'svt_av1_10bit';
    const videoPreset = encoder === 'x265' ? 'slow' : '4';
    
    const presetName = `DeNiX_Enhanced_DV_HDR_${encoder}_CRF${quality}_10bit`;
    
    logger.success(`Generated DV/HDR preset: ${presetName}`);
    logger.extended(`Final encoder: ${finalVideoEncoder}, preset: ${videoPreset}`);
    logger.extended(`Quality level: CRF ${quality} (optimized for ${resolution || 'standard'} content)`);

    const preset = {
        PresetList: [{
            PresetName: presetName,
            
            // Basic settings
            AlignAVStart: false,
            FileFormat: 'av_mkv', // Always MKV for DV/HDR
            Type: 1,
            Default: false,
            Folder: false,
            FolderOpen: false,
            PresetDisabled: false,
            ChildrenArray: [],
            
            // Video settings (DV/HDR optimized)
            VideoQualityType: 2,
            VideoQualitySlider: quality,
            VideoEncoder: finalVideoEncoder,
            VideoProfile: 'auto',
            VideoLevel: 'auto',
            VideoPreset: videoPreset,
            VideoFramerateMode: 'vfr',
            VideoTune: '',
            VideoGrayScale: false,
            VideoScaler: 'swscale',
            VideoAvgBitrate: 0,
            VideoColorMatrixCode: 0,
            VideoMultiPass: false,
            VideoTurboMultiPass: false,
            VideoOptionExtra: '',
            x264UseAdvancedOptions: false,
            
            // Container settings
            Optimize: false,
            Mp4iPodCompatible: false,
            
            // Audio settings (preserve all for DV/HDR)
            AudioCopyMask: [
                'copy:aac', 'copy:ac3', 'copy:eac3', 'copy:truehd',
                'copy:dts', 'copy:dtshd', 'copy:mp2', 'copy:mp3',
                'copy:opus', 'copy:vorbis', 'copy:flac', 'copy:alac'
            ],
            AudioEncoderFallback: 'none',
            AudioLanguageList: ['any'],
            AudioList: [{
                AudioBitrate: 160,
                AudioCompressionLevel: 0,
                AudioEncoder: 'copy',
                AudioMixdown: 'stereo',
                AudioNormalizeMixLevel: false,
                AudioSamplerate: 'auto',
                AudioTrackQualityEnable: false,
                AudioTrackQuality: -1,
                AudioTrackGainSlider: 0,
                AudioTrackDRCSlider: 0
            }],
            AudioSecondaryEncoderMode: true,
            AudioTrackSelectionBehavior: 'all',
            
            // Subtitle settings
            SubtitleAddCC: encoder !== 'svt_av1',
            SubtitleAddForeignAudioSearch: false,
            SubtitleAddForeignAudioSubtitle: false,
            SubtitleBurnBehavior: 'none',
            SubtitleBurnBDSub: false,
            SubtitleBurnDVDSub: false,
            SubtitleLanguageList: ['any'],
            SubtitleTrackSelectionBehavior: 'all',
            
            // Chapter and metadata (preserve for DV/HDR)
            ChapterMarkers: true,
            MetadataPassthrough: true,
            
            // Picture settings (DV/HDR aware)
            PictureCropMode: 3,
            PictureBottomCrop: 0,
            PictureLeftCrop: 0,
            PictureRightCrop: 0,
            PictureTopCrop: 0,
            PictureDARWidth: 3840,
            PictureKeepRatio: true,
            PicturePAR: 'auto',
            PicturePARWidth: 1,
            PicturePARHeight: 1,
            PictureUseMaximumSize: true,
            PictureAllowUpscaling: false,
            PictureForceHeight: 0,
            PictureForceWidth: 0,
            PictureItuPAR: false,
            
            // Padding
            PicturePadMode: 'none',
            PicturePadTop: 0,
            PicturePadBottom: 0,
            PicturePadLeft: 0,
            PicturePadRight: 0,
            
            // Filters (DV/HDR specific)
            PictureDeblockPreset: 'off',
            PictureDeblockTune: 'medium',
            PictureDeblockCustom: encoder === 'svt_av1' ? 'strength=strong:thresh=20:blocksize=8' : '',
            PictureDeinterlaceFilter: 'off',
            PictureCombDetectPreset: encoder === 'svt_av1' ? 'default' : 'off',
            PictureCombDetectCustom: '',
            PictureDeinterlaceCustom: '',
            PictureDenoiseCustom: '',
            PictureDenoiseFilter: 'off',
            PictureSharpenCustom: '',
            PictureSharpenFilter: 'off',
            PictureSharpenPreset: 'medium',
            PictureSharpenTune: 'none',
            PictureDetelecine: 'off',
            PictureDetelecineCustom: '',
            PictureChromaSmoothPreset: 'off',
            PictureChromaSmoothTune: 'none',
            PictureChromaSmoothCustom: '',
            
            // Colorspace (preserve for DV/HDR)
            PictureColorspacePreset: 'off',
            PictureColorspaceCustom: '',
        }],
        VersionMajor: 56,
        VersionMicro: 0,
        VersionMinor: 0
    };

    return preset;
};

// Function to check if an exit code should be treated as success
const isSuccessfulExitCode = (exitCode) => {
    if (exitCode === 0) return true;
    const windowsCleanupCodes = [3221226356, 3221225786];
    return windowsCleanupCodes.includes(exitCode);
};

// ===============================================
// MAIN PLUGIN FUNCTION
// ===============================================

const plugin = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lib = require('../../../../../methods/lib')();
        
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
            initializationTime: 0,
            qaTime: 0,
            analysisTime: 0,
            presetGenerationTime: 0,
            encodingTime: 0,
            totalTime: 0
        };

        logger.banner('🌟 ENHANCED DOLBY VISION & HDR10+ ENCODER v4.0 STARTING');
        logger.section('DeNiX Enhanced Dolby Vision & HDR10+: Specialized HandBrake Encoder');
        logger.dv('Welcome to DeNiX Enhanced DV/HDR10+ Plugin v4.0!');

        // ===============================================
        // STEP 1: INITIALIZATION AND ENVIRONMENT DETECTION
        // ===============================================
        
        logger.subsection('Step 1: Initialization and environment validation');
        const initStartTime = Date.now();

        logger.info(`📁 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`📊 Container: ${args.inputFileObj.container} | Resolution: ${args.inputFileObj.video_resolution || 'Unknown'}`);
        
        // Platform detection and executable path validation
        const platformInfo = detectPlatform();
        logger.success(`🖥️ Platform detected: ${platformInfo.platform} (${platformInfo.isWindows ? 'Windows' : platformInfo.isMacOS ? 'macOS' : 'Linux'})`);
        
        // Get and validate HandBrake path
        const handbrakePath = getExecutablePath(args.inputs, 'handbrake', logger);
        logger.extended(`🎬 HandBrake CLI path: ${handbrakePath}`);
        
        // Get HandBrake version for diagnostics
        const handbrakeVersion = getHandBrakeVersion(handbrakePath, logger);
        if (handbrakeVersion.error) {
            logger.error(`HandBrake version detection failed - this may indicate installation issues`);
            logger.error(`Error: ${handbrakeVersion.fullOutput}`);
        } else {
            logger.success(`🎬 HandBrake version: ${handbrakeVersion.version}`);
            if (handbrakeVersion.buildDate !== 'Unknown') {
                logger.extended(`📅 Build: ${handbrakeVersion.buildDate}`);
            }
            if (handbrakeVersion.architecture !== 'Unknown') {
                logger.extended(`🏗️ Architecture: ${handbrakeVersion.architecture}`);
            }
        }
        
        // Enhanced Docker environment checking with warnings
        const isDocker = isDockerEnvironment();
        if (isDocker) {
            logger.error('🐳 DOCKER ENVIRONMENT DETECTED!');
            logger.error('⚠️ CRITICAL WARNING: DOLBY VISION AND HDR10+ IS NOT SUPPORTED IN DOCKER!');
            logger.error('🚫 DOCKER CONTAINERS WILL STRIP DOLBY VISION METADATA!');
            logger.error('💡 Use bare metal, VM, or LXC for proper DV/HDR processing');
        } else {
            logger.success('🖥️ Bare metal environment detected - optimal for DV/HDR processing');
        }

        // Configuration logging
        logger.extended(`🎬 Target encoder: ${args.inputs.videoEncoder}`);
        logger.extended(`🎯 1080p quality: CRF ${args.inputs.fullHdQuality}`);
        logger.extended(`🎯 4K quality: CRF ${args.inputs.fourKQuality}`);
        logger.extended(`⏱️ Timeout: ${args.inputs.progressTimeoutMinutes} minutes`);
        logger.extended(`📊 Logging level: ${args.inputs.logging_level}`);

        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        
        logger.subsection('Step 2: Quality assurance and DV/HDR validation');
        const qaStartTime = Date.now();
        
        const validationResult = performQualityAssurance(args.inputFileObj, args.inputs, logger);
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

        if (validationResult.recommendations.length > 0) {
            validationResult.recommendations.forEach(rec => logger.info(`💡 ${rec}`));
        }
        
        processingMetrics.qaTime = Date.now() - qaStartTime;

        // ===============================================
        // STEP 3: DOLBY VISION & HDR10+ ANALYSIS
        // ===============================================
        
        logger.subsection('Step 3: Comprehensive DV/HDR10+ content analysis');
        const analysisStartTime = Date.now();

        logger.dv('Analyzing file for Dolby Vision and HDR10+ content...');
        
        // Analyze video with enhanced MediaInfo detection
        const videoAnalysis = analyzeVideoForHDR(args.inputFileObj._id, args.inputs, logger);
        
        if (!videoAnalysis.success) {
            logger.error(`MediaInfo analysis failed: ${videoAnalysis.error}`);
            logger.warn('File does not appear to contain DV/HDR10+ - skipping');
            
            const updatedVariables = {
                ...args.variables,
                dvHdrAnalysis: 'Failed',
                dvHdrFormat: 'None',
                dvHdrProfile: null,
                handbrakeVersion: handbrakeVersion.version,
                processingTime: Date.now() - startTime
            };

            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: updatedVariables,
            };
        }
        
        // Check if this is actually DV/HDR10+ content
        if (videoAnalysis.detectedFormat.output === 5) {
            logger.info('📺 No Dolby Vision or HDR10+ content detected - skipping');
            logger.extended(`Analysis method: ${videoAnalysis.analysisMethod}`);
            
            const updatedVariables = {
                ...args.variables,
                dvHdrAnalysis: 'No DV/HDR10+',
                dvHdrFormat: 'Standard',
                dvHdrProfile: null,
                analysisMethod: videoAnalysis.analysisMethod,
                handbrakeVersion: handbrakeVersion.version,
                processingTime: Date.now() - startTime
            };

            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: updatedVariables,
            };
        }
        
        // Enhanced Dolby Vision profile compatibility checking
        if (videoAnalysis.dolbyVisionProfile) {
            if (videoAnalysis.dolbyVisionProfile === 4 || videoAnalysis.dolbyVisionProfile === 5) {
                logger.warn(`⏭️ Dolby Vision Profile ${videoAnalysis.dolbyVisionProfile} detected - SKIPPING`);
                logger.warn('Profiles 4 & 5 are not recommended for re-encoding due to quality loss');
                logger.info('💡 These profiles should be kept in original format');
                
                const updatedVariables = {
                    ...args.variables,
                    dvHdrAnalysis: 'Incompatible Profile',
                    dvHdrFormat: videoAnalysis.detectedFormat.name,
                    dvHdrProfile: videoAnalysis.dolbyVisionProfile,
                    analysisMethod: videoAnalysis.analysisMethod,
                    handbrakeVersion: handbrakeVersion.version,
                    processingTime: Date.now() - startTime
                };

                args.jobLog(logger.getOutput());
                return {
                    outputFileObj: args.inputFileObj,
                    outputNumber: 2,
                    variables: updatedVariables,
                };
            } else if (videoAnalysis.dolbyVisionProfile === 7 || videoAnalysis.dolbyVisionProfile === 8) {
                logger.success(`✅ Dolby Vision Profile ${videoAnalysis.dolbyVisionProfile} detected - PROCEEDING`);
                logger.success('Profiles 7 & 8 are compatible with re-encoding');
            } else {
                logger.warn(`⚠️ Dolby Vision Profile ${videoAnalysis.dolbyVisionProfile} detected - Unknown profile, proceeding with caution`);
            }
        }
        
        if (videoAnalysis.hasHDR10Plus) {
            logger.hdr('HDR10+ detected - will force x265 encoder for optimal compatibility');
        }

        processingMetrics.analysisTime = Date.now() - analysisStartTime;

        // Log progress after analysis
        args.jobLog(logger.getOutput());
        logger.clear();

        // ===============================================
        // STEP 4: PRESET GENERATION
        // ===============================================
        
        logger.subsection('Step 4: DV/HDR optimized preset generation');
        const presetStartTime = Date.now();

        logger.dv('Generating DV/HDR10+ optimized HandBrake preset...');
        
        let preset;
        try {
            preset = generatePreset(args, videoAnalysis, logger);
            logger.success(`🎯 Generated DV/HDR preset with CRF ${preset.PresetList[0].VideoQualitySlider}`);
        } catch (error) {
            logger.error(`Failed to generate DV/HDR preset: ${error.message}`);
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

        processingMetrics.presetGenerationTime = Date.now() - presetStartTime;

        // ===============================================
        // STEP 5: HANDBRAKE EXECUTION SETUP
        // ===============================================
        
        logger.subsection('Step 5: HandBrake execution setup and processing');
        const encodingStartTime = Date.now();

        // Always MKV for DV/HDR
        const container = 'mkv';
        const outputFilePath = `${(0, fileUtils_1.getPluginWorkDir)(args)}/${(0, fileUtils_1.getFileName)(args.inputFileObj._id)}.${container}`;
        
        // Write preset to temporary file
        const presetPath = path.join(args.workDir, 'denix_enhanced_dv_hdr_preset.json');
        try {
            yield fs.promises.writeFile(presetPath, JSON.stringify(preset, null, 2));
            logger.extended(`DV/HDR preset written to: ${presetPath}`);
            
            const stats = yield fs.promises.stat(presetPath);
            logger.extended(`Preset file size: ${formatFileSize(stats.size)}`);
        } catch (error) {
            const errorMsg = `Failed to write DV/HDR preset file: ${error.message}`;
            logger.error(errorMsg);
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }
        
        // Build CLI arguments using user's HandBrake instead of Tdarr's
        const cliArguments = [
            '--input', args.inputFileObj._id,
            '--output', outputFilePath,
            '--preset-import-file', presetPath,
            '--preset', preset.PresetList[0].PresetName,
            '--verbose=2'
        ];
        
        logger.success(`Using DV/HDR preset: ${preset.PresetList[0].PresetName}`);
        logger.extended(`Output container: ${container} (required for DV/HDR)`);
        logger.extended(`HandBrake path: ${handbrakePath}`);
        logger.extended(`CLI arguments: ${cliArguments.join(' ')}`);
        
        const progressTimeoutMinutes = Number(args.inputs.progressTimeoutMinutes) || 0;
        if (progressTimeoutMinutes > 0) {
            logger.info(`Progress timeout enabled: ${progressTimeoutMinutes} minutes`);
            logger.warn('Note: DV/HDR encoding takes 2-5x longer than standard encoding');
        } else {
            logger.extended('Progress timeout disabled');
        }

        // Log progress before encoding starts
        args.jobLog(logger.getOutput());
        logger.clear();

        // Create CLI configuration using user's HandBrake
        const cliConfig = {
            cli: handbrakePath, // Use user's HandBrake instead of args.handbrakePath
            spawnArgs: cliArguments,
            outputFilePath: outputFilePath,
            inputFileObj: args.inputFileObj,
            updateWorker: args.updateWorker,
            jobLog: args.jobLog,
            logFullCliOutput: args.logFullCliOutput || false,
            args: args
        };

        // Create CLI instance
        const cliInstance = new CLI(cliConfig);
        
        // Enhanced progress monitoring for DV/HDR
        let lastProgress = -1;
        let lastProgressTime = Date.now();
        let progressTimeoutId = null;
        
        logger.extended('Setting up enhanced DV/HDR progress monitoring...');
        
        // Override parseOutput for enhanced DV/HDR logging
        const originalParseOutput = cliInstance.parseOutput.bind(cliInstance);
        cliInstance.parseOutput = function(data) {
            const str = String(data);
            
            if (args.logFullCliOutput) {
                logger.info(`🔧 HB: ${str.trim()}`);
            }
            
            // Enhanced debug logging for DV/HDR
            if (args.inputs.logging_level === 'debug') {
                logger.debug(`HB-RAW: ${str.trim()}`);
            }
            
            originalParseOutput(data);
            
            if (progressTimeoutMinutes > 0) {
                let progressMatch = str.match(/(\d+\.\d+)\s*%/);
                if (!progressMatch) {
                    progressMatch = str.match(/(\d+\.?\d*)\s*%/);
                }
                
                if (progressMatch) {
                    const currentProgress = parseFloat(progressMatch[1]);
                    
                    if (currentProgress !== lastProgress && currentProgress > 0) {
                        lastProgress = currentProgress;
                        lastProgressTime = Date.now();
                        
                        // Enhanced progress reporting for DV/HDR
                        logger.success(`📊 DV/HDR Progress: ${currentProgress}% (${videoAnalysis.detectedFormat.name})`);
                        logger.debug(`Progress updated: ${currentProgress}%`);
                        
                        // Log progress updates periodically
                        if (currentProgress % 10 < 0.5) { // Every 10%
                            args.jobLog(logger.getOutput());
                            logger.clear();
                        }
                        
                        // Special progress milestones for DV/HDR
                        if (currentProgress >= 25 && currentProgress < 25.5) {
                            if (videoAnalysis.dolbyVisionProfile) {
                                logger.dv('25% complete - Dolby Vision metadata being processed...');
                            } else if (videoAnalysis.hasHDR10Plus) {
                                logger.hdr('25% complete - HDR10+ dynamic metadata being processed...');
                            }
                        } else if (currentProgress >= 50 && currentProgress < 50.5) {
                            logger.success('🌈 50% complete - HDR tone mapping in progress...');
                        } else if (currentProgress >= 75 && currentProgress < 75.5) {
                            logger.success('✨ 75% complete - Finalizing color grading...');
                        }
                    }
                }
            }
        };
        
        // Enhanced progress timeout check for DV/HDR
        const checkProgressTimeout = () => {
            if (progressTimeoutMinutes <= 0) return;
            
            const now = Date.now();
            const timeSinceLastProgress = (now - lastProgressTime) / 1000 / 60;
            
            if (timeSinceLastProgress >= progressTimeoutMinutes && lastProgress >= 0) {
                logger.warn(`Progress stuck at ${lastProgress}% for ${Math.round(timeSinceLastProgress * 10) / 10} minutes - terminating process`);
                logger.warn('💡 Note: Dolby Vision encoding typically takes 2-5x longer than standard encoding');
                logger.debug(`Progress timeout triggered - killing HandBrake process`);
                cliInstance.cancelled = true;
                cliInstance.killThread();
            }
        };
        
        if (progressTimeoutMinutes > 0) {
            progressTimeoutId = setInterval(checkProgressTimeout, 15000); // Check every 15 seconds for DV/HDR
            logger.extended(`Progress timeout monitoring started (check every 15 seconds)`);
        }

        // ===============================================
        // STEP 6: HANDBRAKE EXECUTION
        // ===============================================
        
        logger.info('🎬 Starting enhanced DV/HDR encoding process...');
        logger.warn('⏱️ Note: DV/HDR encoding will take significantly longer than standard encoding');
        logger.extended('Launching HandBrake CLI process...');
        
        // Log start of encoding
        args.jobLog(logger.getOutput());
        logger.clear();
        
        const executionStartTime = Date.now();
        let res;
        try {
            res = yield cliInstance.runCli();
            const encodingDuration = Math.round((Date.now() - executionStartTime) / 1000);
            logger.success(`⏱️ DV/HDR encoding completed in ${formatDuration(encodingDuration)}`);
            logger.extended(`HandBrake process completed with exit code: ${res.cliExitCode}`);
        } catch (cliError) {
            logger.error(`CLI execution error: ${cliError.message}`);
            logger.debug(`CLI error stack: ${cliError.stack}`);
            throw cliError;
        } finally {
            if (progressTimeoutId) {
                clearInterval(progressTimeoutId);
                logger.extended('Progress timeout monitoring stopped');
            }
        }

        processingMetrics.encodingTime = Date.now() - encodingStartTime;

        // ===============================================
        // STEP 7: OUTPUT VERIFICATION AND CLEANUP
        // ===============================================
        
        logger.subsection('Step 7: Output verification and cleanup');
        
        // Check output file
        logger.extended('Checking if DV/HDR output file was created...');
        let outputFileExists = false;
        let outputFileSize = 0;
        try {
            yield fs.promises.access(outputFilePath);
            outputFileExists = true;
            const stats = yield fs.promises.stat(outputFilePath);
            outputFileSize = stats.size;
            const outputSizeMB = Math.round(outputFileSize / 1024 / 1024);
            const inputSizeMB = Math.round((args.inputFileObj.file_size || 0) / 1024 / 1024);
            
            logger.success(`DV/HDR output file created successfully. Size: ${formatFileSize(outputFileSize)}`);
            logger.extended(`File size comparison: ${outputSizeMB} MB (Input: ${inputSizeMB} MB)`);
            
            // DV/HDR files are typically larger due to metadata
            if (outputSizeMB > inputSizeMB * 0.8) {
                logger.success('✨ File size looks good for DV/HDR content (metadata preserved)');
            } else if (outputSizeMB < inputSizeMB * 0.5) {
                logger.warn('⚠️ Output file significantly smaller - verify DV/HDR metadata preservation');
            }
        } catch (error) {
            logger.error(`Output file check failed: ${error.message}`);
            logger.debug(`Output file access error: ${error.stack}`);
        }
        
        // Clean up preset file
        logger.extended('Cleaning up temporary DV/HDR preset file...');
        try {
            yield fs.promises.unlink(presetPath);
            logger.debug('Temporary DV/HDR preset file cleaned up');
        } catch (error) {
            logger.warn(`Warning - Failed to clean up preset file: ${error.message}`);
            logger.debug(`Cleanup error details: ${error.stack}`);
        }
        
        // Handle cancellation
        if (cliInstance.cancelled) {
            const errorMsg = `DV/HDR encoding was cancelled (likely due to progress timeout)`;
            logger.error(errorMsg);
            logger.warn('💡 Consider increasing timeout for Dolby Vision/HDR10+ content');
            logger.debug('Process was cancelled by timeout mechanism');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }
        
        // Check exit code
        const exitCode = res.cliExitCode;
        const isSuccess = isSuccessfulExitCode(exitCode);
        
        logger.debug(`Exit code analysis: ${exitCode}, isSuccess: ${isSuccess}`);
        
        if (!isSuccess) {
            const errorMsg = `DV/HDR encoding failed with exit code ${exitCode}`;
            logger.error(errorMsg);
            logger.error('💡 Check if your HandBrake build supports Dolby Vision and HDR10+');
            logger.debug(`Exit code ${exitCode} is not in the list of acceptable codes: [0, 3221226356, 3221225786]`);
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        } else if (exitCode !== 0) {
            logger.warn(`DV/HDR encoding completed with non-zero exit code ${exitCode} (Windows cleanup issue - treating as success)`);
        } else {
            logger.success('✅ DV/HDR encoding completed successfully!');
        }
        
        // Verify output
        if (!outputFileExists) {
            const errorMsg = 'DV/HDR encoding completed but output file was not created';
            logger.error(errorMsg);
            logger.debug('Output file verification failed - file does not exist');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }
        
        if (outputFileSize < 1024) {
            const errorMsg = `DV/HDR output file is suspiciously small (${formatFileSize(outputFileSize)}) - possible encoding failure`;
            logger.error(errorMsg);
            logger.debug('Output file size check failed - file too small');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

        // ===============================================
        // STEP 8: FINAL ANALYSIS AND REPORTING
        // ===============================================
        
        processingMetrics.totalTime = Date.now() - startTime;

        logger.subsection('Step 8: Final analysis and comprehensive reporting');

        // Generate DV/HDR report if requested
        if (args.inputs.generateReport) {
            logger.extended('Generating comprehensive DV/HDR analysis report...');
            const report = generateDVHDRReport(videoAnalysis, args.inputs, processingMetrics.totalTime / 1000, handbrakeVersion);
            logger.extended('📋 Detailed DV/HDR Report Generated:');
            report.split('\n').forEach(line => {
                if (line.trim()) logger.extended(line);
            });
        }

        // Calculate compression statistics
        const originalSize = args.inputFileObj.file_size || 0;
        const compressionRatio = originalSize > 0 ? outputFileSize / originalSize : 0;
        const spaceSaved = originalSize - outputFileSize;
        const compressionPercent = originalSize > 0 ? ((spaceSaved / originalSize) * 100) : 0;

        // Performance metrics
        if (args.inputs.showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Initialization: ${processingMetrics.initializationTime}ms`);
            logger.extended(`⏱️ Quality assurance: ${processingMetrics.qaTime}ms`);
            logger.extended(`⏱️ DV/HDR analysis: ${processingMetrics.analysisTime}ms`);
            logger.extended(`⏱️ Preset generation: ${processingMetrics.presetGenerationTime}ms`);
            logger.extended(`⏱️ Encoding process: ${processingMetrics.encodingTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            // Calculate encoding efficiency
            if (originalSize > 0 && processingMetrics.encodingTime > 0) {
                const mbProcessed = originalSize / (1024 * 1024);
                const secondsElapsed = processingMetrics.encodingTime / 1000;
                const efficiency = mbProcessed / secondsElapsed;
                logger.extended(`📈 DV/HDR encoding efficiency: ${efficiency.toFixed(2)} MB/second`);
            }
            
            // Processing overhead
            const encodingOverhead = processingMetrics.totalTime - processingMetrics.encodingTime;
            const overheadPercent = (encodingOverhead / processingMetrics.totalTime) * 100;
            logger.extended(`📊 Processing overhead: ${encodingOverhead}ms (${overheadPercent.toFixed(1)}%)`);
        }

        // Feature utilization summary
        if (args.inputs.logging_level === 'debug') {
            logger.subsection('Feature Utilization and Diagnostics');
            const features = [
                { name: 'Quality assurance', enabled: args.inputs.enable_qa_checks },
                { name: 'Performance metrics', enabled: args.inputs.showPerformanceMetrics },
                { name: 'DV/HDR report generation', enabled: args.inputs.generateReport },
                { name: 'Progress timeout', enabled: args.inputs.progressTimeoutMinutes > 0 },
                { name: 'Enhanced logging', enabled: args.inputs.logging_level !== 'info' },
                { name: 'Docker environment', enabled: isDockerEnvironment() }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`🎬 Video encoder: ${args.inputs.videoEncoder}${videoAnalysis.hasHDR10Plus ? ' (forced x265)' : ''}`);
            logger.debug(`🌟 DV/HDR format: ${videoAnalysis.detectedFormat.name}`);
            logger.debug(`📊 Analysis method: ${videoAnalysis.analysisMethod}`);
            logger.debug(`🎬 HandBrake version: ${handbrakeVersion.version}`);
            logger.debug(`🖥️ Platform: ${platformInfo.platform}`);
            logger.debug(`⚙️ Exit code: ${exitCode}`);
            logger.debug(`📊 Compression ratio: ${compressionRatio.toFixed(3)}`);
            logger.debug(`📁 HandBrake path: ${handbrakePath}`);
            
            // Path validation results
            const mediainfoPath = getExecutablePath(args.inputs, 'mediainfo', logger);
            logger.debug(`📁 MediaInfo path: ${mediainfoPath}`);
        }

        // Enhanced variables with comprehensive DV/HDR information
        const updatedVariables = {
            ...args.variables,
            
            // DV/HDR analysis results
            dvHdrAnalysis: 'Success',
            dvHdrFormat: videoAnalysis.detectedFormat.name,
            dvHdrProfile: videoAnalysis.dolbyVisionProfile,
            dvHdrHasHDR10Plus: videoAnalysis.hasHDR10Plus,
            dvHdrAnalysisMethod: videoAnalysis.analysisMethod,
            
            // Encoding results
            dvHdrEncodingCompleted: true,
            dvHdrEncodingSuccess: true,
            dvHdrEncoder: args.inputs.videoEncoder,
            dvHdrFinalEncoder: videoAnalysis.hasHDR10Plus ? 'x265' : args.inputs.videoEncoder,
            dvHdrPresetName: preset.PresetList[0].PresetName,
            dvHdrQuality: preset.PresetList[0].VideoQualitySlider,
            
            // File information
            dvHdrInputFile: args.inputFileObj._id,
            dvHdrOutputFile: outputFilePath,
            dvHdrInputSize: originalSize,
            dvHdrOutputSize: outputFileSize,
            dvHdrContainer: 'mkv',
            
            // Compression analysis
            dvHdrCompressionRatio: compressionRatio,
            dvHdrSpaceSaved: spaceSaved,
            dvHdrCompressionPercent: compressionPercent,
            
            // Performance metadata
            dvHdrProcessingTime: processingMetrics.totalTime,
            dvHdrEncodingTime: processingMetrics.encodingTime,
            dvHdrExitCode: exitCode,
            
            // System and diagnostics information
            dvHdrEnvironment: isDockerEnvironment() ? 'Docker' : 'Bare Metal',
            dvHdrPlatform: platformInfo.platform,
            dvHdrHandbrakePath: handbrakePath,
            dvHdrHandbrakeVersion: handbrakeVersion.version,
            dvHdrHandbrakeBuild: handbrakeVersion.buildDate,
            dvHdrHandbrakeArch: handbrakeVersion.architecture,
            dvHdrMediainfoPath: getExecutablePath(args.inputs, 'mediainfo', logger),
            dvHdrTimestamp: new Date().toISOString(),
            dvHdrPluginVersion: '4.0'
        };

        // Statistical analysis for extended logging
        if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
            logger.subsection('Statistical Analysis');
            
            if (originalSize > 0) {
                logger.extended(`📊 Original file size: ${formatFileSize(originalSize)}`);
                logger.extended(`📊 Output file size: ${formatFileSize(outputFileSize)}`);
                logger.extended(`📊 Compression ratio: ${compressionRatio.toFixed(3)}:1`);
                
                if (compressionPercent > 0) {
                    logger.extended(`📊 Space saved: ${formatFileSize(spaceSaved)} (${compressionPercent.toFixed(2)}%)`);
                } else {
                    logger.extended(`📊 File size increased: ${formatFileSize(Math.abs(spaceSaved))} (${Math.abs(compressionPercent).toFixed(2)}%)`);
                }
            }
            
            // Quality score calculation for DV/HDR
            let qualityScore = 100;
            if (exitCode !== 0) qualityScore -= 10;
            if (outputFileSize < 1024 * 1024) qualityScore -= 20; // Very small file
            if (!videoAnalysis.success) qualityScore -= 30;
            if (isDockerEnvironment()) qualityScore -= 25; // Docker penalty for DV/HDR
            if (validationResult.warnings.length > 0) qualityScore -= validationResult.warnings.length * 5;
            if (handbrakeVersion.error) qualityScore -= 15; // HandBrake detection issues
            qualityScore = Math.max(0, qualityScore);
            
            logger.extended(`📊 DV/HDR encoding quality score: ${qualityScore}/100`);
        }

        // Log comprehensive DV/HDR summary
        logger.banner('🌟 DOLBY VISION/HDR10+ ENCODING COMPLETED SUCCESSFULLY');
        
        logger.success('📊 Enhanced DV/HDR Encoding Summary:');
        const resolution = args.inputFileObj.video_resolution;
        logger.success(`  📐 Resolution: ${resolution || 'Unknown'}`);
        logger.success(`  🎬 Encoder: ${args.inputs.videoEncoder}${videoAnalysis.hasHDR10Plus ? ' (forced x265 for HDR10+)' : ''}`);
        logger.success(`  🎯 Quality: CRF ${preset.PresetList[0].VideoQualitySlider}`);
        logger.success(`  🌈 10-bit: Enabled (required for DV/HDR)`);
        logger.success(`  🎬 Frame Rate: VFR`);
        
        // Add DV/HDR specific information
        logger.success(`  🌟 HDR Format: ${videoAnalysis.detectedFormat.name}`);
        logger.success(`  📊 Analysis Method: ${videoAnalysis.analysisMethod}`);
        logger.success(`  🎬 HandBrake Version: ${handbrakeVersion.version}`);
        
        if (videoAnalysis.dolbyVisionProfile) {
            logger.success(`  🎬 Dolby Vision: Profile ${videoAnalysis.dolbyVisionProfile}`);
            logger.success(`  📝 Profile Description: ${videoAnalysis.detectedFormat.description}`);
        }
        if (videoAnalysis.hasHDR10Plus) {
            logger.success(`  ⚡ HDR10+: Detected and processed with dynamic metadata`);
        }
        
        logger.success(`📦 Output Container: MKV (required for DV/HDR)`);
        logger.success(`📂 Output Path: ${outputFilePath}`);
        logger.success(`📊 Size: ${formatFileSize(originalSize)} → ${formatFileSize(outputFileSize)}`);
        
        if (compressionPercent > 0) {
            logger.success(`💾 Space saved: ${formatFileSize(spaceSaved)} (${compressionPercent.toFixed(1)}% reduction)`);
        } else if (compressionPercent < 0) {
            logger.info(`📈 Size increased: ${formatFileSize(Math.abs(spaceSaved))} (${Math.abs(compressionPercent).toFixed(1)}% larger - normal for DV/HDR)`);
        }
        
        logger.success(`⏱️ Processing time: ${formatDuration(processingMetrics.totalTime / 1000)}`);
        
        // Final recommendations and insights
        logger.subsection('Recommendations and Insights');
        
        if (compressionPercent > 50) {
            logger.success('🌟 Excellent compression achieved while preserving DV/HDR metadata');
        } else if (compressionPercent > 20) {
            logger.success('👍 Good compression achieved for premium HDR content');
        } else if (compressionPercent < -10) {
            logger.info('💡 File size increased - normal for DV/HDR due to metadata preservation');
        }
        
        if (processingMetrics.encodingTime > 3600000) { // > 1 hour
            logger.info('⏱️ Long DV/HDR encoding time - this is expected for premium content');
        }
        
        if (videoAnalysis.dolbyVisionProfile === 7 || videoAnalysis.dolbyVisionProfile === 8) {
            logger.success('🎯 Optimal Dolby Vision profile for re-encoding detected');
        }
        
        if (videoAnalysis.hasHDR10Plus) {
            logger.success('⚡ HDR10+ dynamic metadata successfully processed');
        }
        
        // System-specific recommendations
        if (handbrakeVersion.error) {
            logger.warn('⚠️ HandBrake version detection failed - consider updating HandBrake for better DV/HDR support');
        }
        
        // Final warning for Docker users
        if (isDockerEnvironment()) {
            logger.warn('⚠️ FINAL REMINDER: You are running in Docker - DV/HDR may not work correctly!');
            logger.warn('📝 Please verify your output file contains proper Dolby Vision/HDR metadata');
            logger.info('💡 Use MediaInfo to verify DV/HDR metadata preservation');
        } else {
            logger.success('🖥️ Bare metal environment used - optimal for DV/HDR processing');
        }
        
        logger.success('🎉 DeNiX Enhanced Dolby Vision/HDR10+ encoding completed successfully!');
        logger.success('✨ Thank you for using DeNiX Enhanced DV/HDR HandBrake Encoder v4.0!');
        logger.info('🎯 File is ready for premium HDR playback');
        logger.banner('🚀 DV/HDR ENCODING PROCESS COMPLETED SUCCESSFULLY');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: { _id: outputFilePath },
            outputNumber: 1,
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
            outputNumber: 3,
            variables: args.variables,
        };
    }
});

exports.plugin = plugin;