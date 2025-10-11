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
    name: '🎬 DeNiX Enhanced HandBrake: Smart Encoder with Resolution & Bitrate Control v4.0',
    description: 'Advanced HandBrake encoding system with intelligent resolution-based quality, smart bitrate filtering, comprehensive logging, and enhanced performance monitoring. Features quality-based defaults and modern codec support with detailed progress tracking.',
    style: {
        borderColor: '#FF6B35',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        // Enhanced bright orange-red glow with 10 layers - expanded reach with graduated opacity
        boxShadow: `
            0 0 10px rgba(255, 107, 53, 0.5),
            0 0 25px rgba(255, 107, 53, 0.46),
            0 0 40px rgba(255, 107, 53, 0.42),
            0 0 55px rgba(255, 107, 53, 0.39),
            0 0 70px rgba(255, 107, 53, 0.35),
            0 0 85px rgba(255, 107, 53, 0.31),
            0 0 100px rgba(255, 107, 53, 0.27),
            0 0 115px rgba(255, 107, 53, 0.23),
            0 0 130px rgba(255, 107, 53, 0.19),
            0 0 145px rgba(255, 107, 53, 0.17),
            0 0 160px rgba(255, 107, 53, 0.15),
            inset 0 0 20px rgba(255, 107, 53, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(255, 152, 0, 0.1))',
    },
    tags: 'video,handbrake,encoder,resolution,quality,bitrate,hevc,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🎬',
    inputs: [
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
                     'Required for encoding on Linux.',
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
                     'Required for encoding on Windows.',
        },

        // Video Encoder Selection
        {
            label: '🎬 Video Encoder',
            name: 'videoEncoder',
            type: 'string',
            defaultValue: 'x265',
            inputUI: {
                type: 'dropdown',
                options: [
                    { label: 'x265 (HEVC - Best Quality)', value: 'x265' },
                    { label: 'x264 (H.264 - Best Compatibility)', value: 'x264' },
                    { label: 'NVENC HEVC (NVIDIA GPU)', value: 'nvenc_hevc' },
                    { label: 'NVENC H.264 (NVIDIA GPU)', value: 'nvenc_h264' },
                    { label: 'NVENC AV1 (NVIDIA GPU - Latest)', value: 'nvenc_av1' },
                    { label: 'QSV HEVC (Intel GPU)', value: 'qsv_hevc' },
                    { label: 'QSV H.264 (Intel GPU)', value: 'qsv_h264' },
                    { label: 'QSV AV1 (Intel GPU - Latest)', value: 'qsv_av1' },
                    { label: 'AMF HEVC (AMD GPU)', value: 'amf_hevc' },
                    { label: 'AMF H.264 (AMD GPU)', value: 'amf_h264' },
                    { label: 'AMF AV1 (AMD GPU - Latest)', value: 'amf_av1' },
                    { label: 'SVT-AV1 (CPU - Future-proof)', value: 'svt_av1' },
                    { label: 'Jellyfin Compatible (x264 MP4)', value: 'jellyfin_compatible' },
                ],
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Select the video encoder based on your hardware and quality needs',
        },
        
        // 10-bit Toggle
        {
            label: '🌈 10-bit Encoding',
            name: 'tenBitEncoding',
            type: 'boolean',
            defaultValue: true,
            inputUI: {
                type: 'switch',
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Enable 10-bit encoding for better color accuracy (when supported by encoder)',
        },

        // Frame Rate Settings
        {
            label: '🎬 Frame Rate Mode',
            name: 'framerateMode',
            type: 'string',
            defaultValue: 'vfr',
            inputUI: {
                type: 'dropdown',
                options: [
                    { label: 'VFR (Variable Frame Rate - Recommended)', value: 'vfr' },
                    { label: 'CFR (Constant Frame Rate)', value: 'cfr' },
                ],
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'VFR preserves original timing, CFR forces constant frame rate',
        },

        // Resolution-based Quality Settings (6 separate tiers)
        {
            label: '📱 480p/576p Quality (CQ)',
            name: 'lowResQuality',
            type: 'number',
            defaultValue: 22,
            inputUI: {
                type: 'slider',
                min: 1,
                max: 30,
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Quality setting for 480p/576p content (1=highest quality, 30=lowest quality)',
        },

        {
            label: '📺 720p Quality (CQ)',
            name: 'hdQuality',
            type: 'number',
            defaultValue: 21,
            inputUI: {
                type: 'slider',
                min: 1,
                max: 30,
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Quality setting for 720p content (1=highest quality, 30=lowest quality)',
        },

        {
            label: '🖥️ 1080p Quality (CQ)',
            name: 'fullHdQuality',
            type: 'number',
            defaultValue: 20,
            inputUI: {
                type: 'slider',
                min: 1,
                max: 30,
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Quality setting for 1080p content (1=highest quality, 30=lowest quality)',
        },

        {
            label: '🎬 4K Quality (CQ)',
            name: 'fourKQuality',
            type: 'number',
            defaultValue: 18,
            inputUI: {
                type: 'slider',
                min: 1,
                max: 30,
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Quality setting for 4K content (1=highest quality, 30=lowest quality)',
        },

        {
            label: '🌟 8K Quality (CQ)',
            name: 'eightKQuality',
            type: 'number',
            defaultValue: 16,
            inputUI: {
                type: 'slider',
                min: 1,
                max: 30,
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Quality setting for 8K content (1=highest quality, 30=lowest quality)',
        },

        {
            label: '❓ Other/Unknown Quality (CQ)',
            name: 'otherQuality',
            type: 'number',
            defaultValue: 20,
            inputUI: {
                type: 'slider',
                min: 1,
                max: 30,
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Quality setting for unknown or non-standard resolutions (1=highest quality, 30=lowest quality)',
        },

        // Bitrate Filtering Options
        {
            label: '📊 Enable Bitrate Filtering',
            name: 'enableBitrateFiltering',
            type: 'boolean',
            defaultValue: true,
            inputUI: {
                type: 'switch',
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: false
                }
            },
            tooltip: 'Skip encoding if file already meets bitrate and codec requirements',
        },

        {
            label: '🎯 Target Codec for Filtering',
            name: 'targetCodec',
            type: 'string',
            defaultValue: 'hevc',
            inputUI: {
                type: 'dropdown',
                options: [
                    { label: 'HEVC (h265)', value: 'hevc' },
                    { label: 'AV1', value: 'av1' },
                    { label: 'H.264', value: 'h264' },
                ],
                displayConditions: [
                    {
                        inputsDBKey: 'useCustomPreset',
                        operator: '===',
                        value: false
                    },
                    {
                        inputsDBKey: 'enableBitrateFiltering',
                        operator: '===',
                        value: true
                    }
                ]
            },
            tooltip: 'Skip encoding if file is already in this codec and meets bitrate requirements',
        },

        {
            label: '📊 Bitrate Unit',
            name: 'bitrateUnit',
            type: 'string',
            defaultValue: 'kbps',
            inputUI: {
                type: 'dropdown',
                options: [
                    { label: 'bps', value: 'bps' },
                    { label: 'kbps', value: 'kbps' },
                    { label: 'mbps', value: 'mbps' },
                ],
                displayConditions: [
                    {
                        inputsDBKey: 'useCustomPreset',
                        operator: '===',
                        value: false
                    },
                    {
                        inputsDBKey: 'enableBitrateFiltering',
                        operator: '===',
                        value: true
                    }
                ]
            },
            tooltip: 'Unit for bitrate calculations',
        },

        // Bitrate Thresholds (6 separate tiers)
        {
            label: '🎯 480p/576p Bitrate Target',
            name: 'lowResBitrate',
            type: 'number',
            defaultValue: 1250,
            inputUI: {
                type: 'text',
                displayConditions: [
                    {
                        inputsDBKey: 'useCustomPreset',
                        operator: '===',
                        value: false
                    },
                    {
                        inputsDBKey: 'enableBitrateFiltering',
                        operator: '===',
                        value: true
                    }
                ]
            },
            tooltip: 'Skip encoding if 480p/576p file bitrate is already below this threshold',
        },

        {
            label: '🎯 720p Bitrate Target',
            name: 'hdBitrate',
            type: 'number',
            defaultValue: 2250,
            inputUI: {
                type: 'text',
                displayConditions: [
                    {
                        inputsDBKey: 'useCustomPreset',
                        operator: '===',
                        value: false
                    },
                    {
                        inputsDBKey: 'enableBitrateFiltering',
                        operator: '===',
                        value: true
                    }
                ]
            },
            tooltip: 'Skip encoding if 720p file bitrate is already below this threshold',
        },

        {
            label: '🎯 1080p Bitrate Target',
            name: 'fullHdBitrate',
            type: 'number',
            defaultValue: 3500,
            inputUI: {
                type: 'text',
                displayConditions: [
                    {
                        inputsDBKey: 'useCustomPreset',
                        operator: '===',
                        value: false
                    },
                    {
                        inputsDBKey: 'enableBitrateFiltering',
                        operator: '===',
                        value: true
                    }
                ]
            },
            tooltip: 'Skip encoding if 1080p file bitrate is already below this threshold',
        },

        {
            label: '🎯 4K Bitrate Target',
            name: 'fourKBitrate',
            type: 'number',
            defaultValue: 6500,
            inputUI: {
                type: 'text',
                displayConditions: [
                    {
                        inputsDBKey: 'useCustomPreset',
                        operator: '===',
                        value: false
                    },
                    {
                        inputsDBKey: 'enableBitrateFiltering',
                        operator: '===',
                        value: true
                    }
                ]
            },
            tooltip: 'Skip encoding if 4K file bitrate is already below this threshold',
        },

        {
            label: '🎯 8K Bitrate Target',
            name: 'eightKBitrate',
            type: 'number',
            defaultValue: 12500,
            inputUI: {
                type: 'text',
                displayConditions: [
                    {
                        inputsDBKey: 'useCustomPreset',
                        operator: '===',
                        value: false
                    },
                    {
                        inputsDBKey: 'enableBitrateFiltering',
                        operator: '===',
                        value: true
                    }
                ]
            },
            tooltip: 'Skip encoding if 8K file bitrate is already below this threshold',
        },

        {
            label: '🎯 Other/Unknown Bitrate Target',
            name: 'otherBitrate',
            type: 'number',
            defaultValue: 3500,
            inputUI: {
                type: 'text',
                displayConditions: [
                    {
                        inputsDBKey: 'useCustomPreset',
                        operator: '===',
                        value: false
                    },
                    {
                        inputsDBKey: 'enableBitrateFiltering',
                        operator: '===',
                        value: true
                    }
                ]
            },
            tooltip: 'Skip encoding if unknown resolution file bitrate is already below this threshold',
        },

        // Progress Timeout
        {
            label: '⏱️ Progress Timeout (minutes)',
            name: 'progressTimeoutMinutes',
            type: 'number',
            defaultValue: 5,
            inputUI: {
                type: 'text',
            },
            tooltip: 'Kill process if stuck (0 = disabled)',
        },

        // Custom Preset Toggle (at the bottom)
        {
            label: '⚙️ Use Custom JSON Preset',
            name: 'useCustomPreset',
            type: 'boolean',
            defaultValue: false,
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Enable to use your own custom HandBrake JSON preset instead of smart mode',
        },

        // Custom Preset Input (only shown when toggle is enabled)
        {
            label: '📄 Custom HandBrake JSON Preset',
            name: 'customPreset',
            type: 'string',
            defaultValue: '',
            inputUI: {
                type: 'textarea',
                style: {
                    height: '400px',
                    width: '80%',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                },
                displayConditions: {
                    inputsDBKey: 'useCustomPreset',
                    operator: '===',
                    value: true
                }
            },
            tooltip: 'Paste your custom HandBrake JSON preset here. All smart features will be disabled.',
        },

        // Enhanced Features
        {
            label: '🛡️ Enable Quality Assurance',
            name: 'enable_qa_checks',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable quality assurance checks and validation with detailed analysis',
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
            tooltip: '✅ Encoding completed successfully',
        },
        {
            number: 2,
            tooltip: '⭐ File skipped - already meets requirements',
        },
        {
            number: 3,
            tooltip: '❌ Error occurred during encoding process',
        },
    ],
});
exports.details = details;

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
    
    if (executableType === 'handbrake') {
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
// FIXED LOGGING UTILITY FOR TDARR
// ===============================================

class Logger {
    constructor(level = 'info', jobLogFunction) {
        this.level = level;
        this.jobLog = jobLogFunction;
    }

    info(message) {
        const logMsg = `ℹ️  ${message}`;
        this.jobLog(logMsg);
    }

    extended(message) {
        if (['extended', 'debug'].includes(this.level)) {
            const logMsg = `📊 ${message}`;
            this.jobLog(logMsg);
        }
    }

    debug(message) {
        if (this.level === 'debug') {
            const logMsg = `🔍 ${message}`;
            this.jobLog(logMsg);
        }
    }

    warn(message) {
        const logMsg = `⚠️  ${message}`;
        this.jobLog(logMsg);
    }

    error(message) {
        const logMsg = `❌ ${message}`;
        this.jobLog(logMsg);
    }

    success(message) {
        const logMsg = `✅ ${message}`;
        this.jobLog(logMsg);
    }

    progress(message) {
        const logMsg = `📈 ${message}`;
        this.jobLog(logMsg);
    }

    section(title) {
        this.jobLog(`\n🎯 ${title}`);
        this.jobLog('─'.repeat(50));
    }

    subsection(title) {
        this.jobLog(`\n📋 ${title}:`);
    }
	banner(message) {
        const border = '═'.repeat(Math.min(message.length + 4, 60));
        this.jobLog(`\n╔${border}╗`);
        this.jobLog(`║  ${message.padEnd(Math.min(message.length, 56))}  ║`);
        this.jobLog(`╚${border}╝`);
    }
}

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

// Resolution detection function with proper 6 tiers
const detectResolutionTier = (resolution) => {
    switch (resolution) {
        case '480p':
        case '576p':
            return { tier: 1, name: 'Low (480p/576p)', category: 'lowRes' };
        case '720p':
            return { tier: 2, name: 'HD (720p)', category: 'hd' };
        case '1080p':
        case '1440p':
            return { tier: 3, name: 'Full HD (1080p/1440p)', category: 'fullHd' };
        case '4KUHD':
        case 'DCI4K':
            return { tier: 4, name: '4K Ultra HD', category: 'fourK' };
        case '8KUHD':
            return { tier: 5, name: '8K Ultra HD', category: 'eightK' };
        default:
            return { tier: 6, name: 'Other/Unknown', category: 'other' };
    }
};

// Quality assurance validation
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
            result.errorMessage = 'Not a video file - cannot be processed with HandBrake';
            return result;
        }

        // Check for required data
        if (!inputFileObj.ffProbeData || !inputFileObj.ffProbeData.streams) {
            result.warnings.push('Missing ffProbe data - bitrate filtering may not work correctly');
        }

        // Validate quality settings
        const qualitySettings = [
            inputs.lowResQuality, inputs.hdQuality, inputs.fullHdQuality,
            inputs.fourKQuality, inputs.eightKQuality, inputs.otherQuality
        ];
        
        qualitySettings.forEach((quality, index) => {
            if (quality < 1 || quality > 30) {
                result.warnings.push(`Quality setting ${index + 1} is outside recommended range (1-30)`);
            }
        });

        // Check bitrate settings if filtering is enabled
        if (inputs.enableBitrateFiltering) {
            const bitrateSettings = [
                inputs.lowResBitrate, inputs.hdBitrate, inputs.fullHdBitrate,
                inputs.fourKBitrate, inputs.eightKBitrate, inputs.otherBitrate
            ];
            
            bitrateSettings.forEach((bitrate, index) => {
                if (bitrate <= 0) {
                    result.warnings.push(`Bitrate setting ${index + 1} must be greater than 0`);
                }
            });
        }

        // Check executable paths
        const platformInfo = detectPlatform();
        const handbrakePath = getExecutablePath(inputs, 'handbrake', logger);
        
        // Test HandBrake accessibility
        const handbrakeTest = testExecutable(handbrakePath, logger);
        if (!handbrakeTest.success) {
            result.canProcess = false;
            result.errorMessage = `HandBrake CLI not accessible at "${handbrakePath}" - encoding cannot proceed`;
            return result;
        }

        logger.success('Quality assurance validation completed');

    } catch (error) {
        result.warnings.push(`QA check encountered error: ${error.message}`);
    }

    return result;
};

// Check if file meets codec and bitrate requirements
const checkFileRequirements = (args, inputFileObj, logger) => {
    logger.debug('Starting comprehensive file requirements check...');
    
    if (!args.inputs.enableBitrateFiltering) {
        logger.debug('Bitrate filtering is disabled - proceeding with encoding');
        return { shouldSkip: false, reason: 'Bitrate filtering disabled' };
    }

    logger.extended('Bitrate filtering enabled - analyzing codec and bitrate requirements...');

    // Check codec
    let currentCodec = null;
    if (inputFileObj.ffProbeData && inputFileObj.ffProbeData.streams) {
        inputFileObj.ffProbeData.streams.forEach(function (stream) {
            if (stream.codec_type === 'video') {
                currentCodec = stream.codec_name;
                logger.debug(`Detected video codec: ${currentCodec}`);
            }
        });
    }

    if (!currentCodec) {
        logger.warn('No video codec detected in ffProbe data');
        return { shouldSkip: false, reason: 'No video codec detected' };
    }

    // Map codec names to target codec
    const codecMap = {
        'h264': 'h264',
        'h265': 'hevc',
        'hevc': 'hevc',
        'av01': 'av1',
        'av1': 'av1'
    };

    const mappedCodec = codecMap[currentCodec.toLowerCase()];
    const targetCodec = args.inputs.targetCodec;
    
    logger.extended(`Codec analysis: ${currentCodec} → ${mappedCodec}, target: ${targetCodec}`);

    if (mappedCodec !== targetCodec) {
        logger.info(`Codec conversion needed: ${currentCodec} → ${targetCodec}`);
        return { shouldSkip: false, reason: `Codec conversion required: ${currentCodec} → ${targetCodec}` };
    }

    // Check bitrate
    let currentBitrate = null;
    if (inputFileObj.mediaInfo && inputFileObj.mediaInfo.track) {
        inputFileObj.mediaInfo.track.forEach(function (stream) {
            if (stream['@type'].toLowerCase() === 'video' && stream.BitRate) {
                currentBitrate = Number(stream.BitRate);
                logger.extended(`Video bitrate detected: ${formatFileSize(currentBitrate)}/s (${Math.round(currentBitrate/1000)} kbps)`);
            }
        });
    }

    if (!currentBitrate) {
        logger.warn('No bitrate information found in mediaInfo - proceeding with encoding');
        return { shouldSkip: false, reason: 'No bitrate information available' };
    }

    // Get resolution tier and target bitrate
    const resolution = inputFileObj.video_resolution;
    const resolutionTier = detectResolutionTier(resolution);
    
    logger.extended(`Resolution analysis: ${resolution} → ${resolutionTier.name} (tier ${resolutionTier.tier})`);
    
    let targetBitrate = 0;
    switch (resolutionTier.category) {
        case 'lowRes':
            targetBitrate = Number(args.inputs.lowResBitrate);
            break;
        case 'hd':
            targetBitrate = Number(args.inputs.hdBitrate);
            break;
        case 'fullHd':
            targetBitrate = Number(args.inputs.fullHdBitrate);
            break;
        case 'fourK':
            targetBitrate = Number(args.inputs.fourKBitrate);
            break;
        case 'eightK':
            targetBitrate = Number(args.inputs.eightKBitrate);
            break;
        case 'other':
        default:
            targetBitrate = Number(args.inputs.otherBitrate);
            break;
    }

    // Convert target bitrate to bps based on unit
    let targetBitrateBps = targetBitrate;
    if (args.inputs.bitrateUnit === 'kbps') {
        targetBitrateBps *= 1000;
    } else if (args.inputs.bitrateUnit === 'mbps') {
        targetBitrateBps *= 1000000;
    }
    
    logger.extended(`Bitrate target: ${targetBitrate} ${args.inputs.bitrateUnit} = ${targetBitrateBps} bps`);

    // Check if current bitrate is already below target
    if (currentBitrate <= targetBitrateBps) {
        const currentMbps = Math.round(currentBitrate / 1000000 * 100) / 100;
        const targetMbps = Math.round(targetBitrateBps / 1000000 * 100) / 100;
        logger.success(`File already optimized - current bitrate ${currentMbps}Mbps ≤ target ${targetMbps}Mbps`);
        return { 
            shouldSkip: true, 
            reason: `File already optimized - ${currentCodec} ${currentMbps}Mbps ≤ ${targetMbps}Mbps target`,
            currentBitrate: currentBitrate,
            targetBitrate: targetBitrateBps
        };
    }

    logger.info(`File needs encoding - current bitrate ${Math.round(currentBitrate/1000)}kbps > target ${Math.round(targetBitrateBps/1000)}kbps`);
    return { shouldSkip: false, reason: 'File needs encoding for bitrate optimization' };
};

// Generate HandBrake preset based on user selections and actual working presets
const generatePreset = (args, resolutionTier, logger) => {
    logger.debug('Starting intelligent preset generation...');
    
    const encoder = args.inputs.videoEncoder;
    logger.extended(`Selected encoder: ${encoder}`);
    
    // Determine quality setting based on resolution tier
    let quality;
    switch (resolutionTier.category) {
        case 'lowRes':
            quality = Number(args.inputs.lowResQuality);
            break;
        case 'hd':
            quality = Number(args.inputs.hdQuality);
            break;
        case 'fullHd':
            quality = Number(args.inputs.fullHdQuality);
            break;
        case 'fourK':
            quality = Number(args.inputs.fourKQuality);
            break;
        case 'eightK':
            quality = Number(args.inputs.eightKQuality);
            break;
        case 'other':
        default:
            quality = Number(args.inputs.otherQuality);
            break;
    }
    
    logger.extended(`Quality setting for ${resolutionTier.name}: CRF ${quality}`);

    // Determine final encoder and settings based on encoder type and 10-bit selection
    let finalVideoEncoder;
    let videoProfile = 'auto';
    let videoPreset;
    let fileFormat = 'av_mkv';
    let audioCopyMask = [
		'copy:aac', 'copy:ac3', 'copy:eac3', 'copy:truehd',
		'copy:dts', 'copy:dtshd', 'copy:mp2', 'copy:mp3',
		'copy:opus', 'copy:vorbis', 'copy:flac', 'copy:alac'
	];
    let audioSecondaryEncoderMode = true;
    let pictureDARWidth = 1920;
    let pictureCombDetectPreset = 'off';
    let videoHWDecode = null;
    let videoQSVDecode = null;
    let optimize = false;
    let videoTune = '';
    let audioEncoderFallback = 'none';

    // Audio settings - default for most encoders
    let audioSettings = {
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
    };

    logger.debug(`10-bit encoding enabled: ${args.inputs.tenBitEncoding}`);
    logger.debug(`Frame rate mode: ${args.inputs.framerateMode}`);

    // Configure based on encoder type
    switch (encoder) {
        case 'x265':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'x265_10bit' : 'x265';
            videoPreset = 'slow';
            logger.extended(`x265 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'x264':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'x264_10bit' : 'x264';
            videoPreset = 'veryslow';
            videoTune = 'fastdecode';
            optimize = true;
            audioSettings.AudioBitrate = 640;
            audioSettings.AudioMixdown = '5point1';
            pictureDARWidth = 3840;
            logger.extended(`x264 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}, tune: ${videoTune}`);
            break;
            
        case 'nvenc_hevc':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'nvenc_h265_10bit' : 'nvenc_h265';
            videoPreset = 'slowest';
            audioSecondaryEncoderMode = false;
            logger.extended(`NVENC HEVC encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'nvenc_h264':
            finalVideoEncoder = 'nvenc_h264'; // No 10-bit for H.264
            videoPreset = 'slowest';
            audioSecondaryEncoderMode = false;
            logger.extended(`NVENC H.264 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'nvenc_av1':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'nvenc_av1_10bit' : 'nvenc_av1';
            videoPreset = 'slowest';
            audioSecondaryEncoderMode = false;
            logger.extended(`NVENC AV1 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'qsv_hevc':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'qsv_h265_10bit' : 'qsv_h265';
            videoPreset = 'quality';
            videoProfile = args.inputs.tenBitEncoding ? 'main10' : 'auto';
            videoHWDecode = 1;
            videoQSVDecode = true;
            pictureDARWidth = 3840;
            logger.extended(`QSV HEVC encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}, profile: ${videoProfile}`);
            break;
            
        case 'qsv_h264':
            finalVideoEncoder = 'qsv_h264'; // No 10-bit for H.264
            videoPreset = 'quality';
            videoHWDecode = 1;
            videoQSVDecode = true;
            pictureDARWidth = 3840;
            logger.extended(`QSV H.264 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'qsv_av1':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'qsv_av1_10bit' : 'qsv_av1';
            videoPreset = 'quality';
            videoProfile = args.inputs.tenBitEncoding ? 'main' : 'auto';
            videoHWDecode = 1;
            videoQSVDecode = true;
            pictureDARWidth = 3840;
            logger.extended(`QSV AV1 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}, profile: ${videoProfile}`);
            break;
            
        case 'amf_hevc':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'vce_h265_10bit' : 'vce_h265';
            videoPreset = 'quality';
            videoHWDecode = 1;
            videoQSVDecode = true;
            pictureDARWidth = 3840;
            logger.extended(`AMF HEVC encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'amf_h264':
            finalVideoEncoder = 'vce_h264'; // No 10-bit for H.264
            videoPreset = 'quality';
            videoHWDecode = 1;
            videoQSVDecode = true;
            pictureDARWidth = 3840;
            logger.extended(`AMF H.264 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'amf_av1':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'vce_av1_10bit' : 'vce_av1';
            videoPreset = 'quality';
            videoHWDecode = 1;
            videoQSVDecode = true;
            pictureDARWidth = 3840;
            logger.extended(`AMF AV1 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'svt_av1':
            finalVideoEncoder = args.inputs.tenBitEncoding ? 'svt_av1_10bit' : 'svt_av1';
            videoPreset = '4';
            pictureDARWidth = 3840;
            pictureCombDetectPreset = 'default';
            logger.extended(`SVT-AV1 encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}`);
            break;
            
        case 'jellyfin_compatible':
            finalVideoEncoder = 'x264';
            videoPreset = 'veryslow';
            videoTune = 'fastdecode';
            fileFormat = 'av_mp4';
            optimize = true;
            audioEncoderFallback = 'av_aac';
            audioSecondaryEncoderMode = false;
            audioCopyMask = ['copy:aac'];
            audioSettings = {
                AudioBitrate: 512,
                AudioCompressionLevel: 0,
                AudioEncoder: 'av_aac',
                AudioMixdown: '5point1',
                AudioNormalizeMixLevel: false,
                AudioSamplerate: 'auto',
                AudioTrackQualityEnable: false,
                AudioTrackQuality: -1,
                AudioTrackGainSlider: 0,
                AudioTrackDRCSlider: 0
            };
            pictureDARWidth = 3840;
            logger.extended(`Jellyfin compatible encoder configured: ${finalVideoEncoder}, preset: ${videoPreset}, format: ${fileFormat}`);
            break;
            
        default:
            logger.error(`ERROR: Unsupported encoder: ${encoder}`);
            throw new Error(`Unsupported encoder: ${encoder}`);
    }

    const presetName = `DeNiX_Enhanced_${encoder}_CRF${quality}_${resolutionTier.tier}${args.inputs.tenBitEncoding ? '_10bit' : ''}`;
    logger.success(`Generated preset name: ${presetName}`);

    // Log all the configuration details
    logger.debug(`Final encoder configuration:`);
    logger.debug(`  Video Encoder: ${finalVideoEncoder}`);
    logger.debug(`  Video Preset: ${videoPreset}`);
    logger.debug(`  Video Profile: ${videoProfile}`);
    logger.debug(`  Video Tune: ${videoTune}`);
    logger.debug(`  File Format: ${fileFormat}`);
    logger.debug(`  Hardware Decode: ${videoHWDecode}`);
    logger.debug(`  QSV Decode: ${videoQSVDecode}`);
    logger.debug(`  Audio Copy Mask: ${JSON.stringify(audioCopyMask)}`);
    logger.debug(`  Audio Secondary Encoder Mode: ${audioSecondaryEncoderMode}`);
    logger.debug(`  Picture DAR Width: ${pictureDARWidth}`);

    // Create the preset with proper HandBrake structure
    const preset = {
        PresetList: [
            {
                AlignAVStart: fileFormat === 'av_mp4',
                AudioCopyMask: audioCopyMask,
                AudioEncoderFallback: audioEncoderFallback,
                AudioLanguageList: ['any'],
                AudioList: [audioSettings],
                AudioSecondaryEncoderMode: audioSecondaryEncoderMode,
                AudioTrackSelectionBehavior: 'all',
                ChapterMarkers: true,
                ChildrenArray: [],
                Default: false,
                FileFormat: fileFormat,
                Folder: false,
                FolderOpen: false,
                // Use correct metadata property name based on encoder
                ...(encoder === 'jellyfin_compatible' || encoder.includes('x264') || encoder.includes('nvenc') ? 
                    { MetadataPassthru: true } : 
                    { MetadataPassthrough: true }),
                Mp4iPodCompatible: false,
                Optimize: optimize,
                PictureAllowUpscaling: false,
                PictureBottomCrop: 0,
                PictureChromaSmoothCustom: '',
                PictureChromaSmoothPreset: 'off',
                PictureChromaSmoothTune: 'none',
                PictureColorspaceCustom: encoder === 'jellyfin_compatible' ? 'primaries=bt709:transfer=bt709:matrix=bt709:tonemap=reinhard:desat=2' : '',
                PictureColorspacePreset: encoder === 'jellyfin_compatible' ? 'custom' : 'off',
                PictureCombDetectCustom: '',
                PictureCombDetectPreset: pictureCombDetectPreset,
                PictureCropMode: 3,
                PictureDARWidth: pictureDARWidth,
                PictureDeblockCustom: encoder.includes('svt') || encoder.includes('vce') || encoder.includes('qsv') ? 'strength=strong:thresh=20:blocksize=8' : '',
                PictureDeblockPreset: 'off',
                PictureDeblockTune: 'medium',
                PictureDeinterlaceCustom: '',
                PictureDeinterlaceFilter: 'off',
                ...(encoder !== 'jellyfin_compatible' && { PictureDenoiseCustom: '' }),
                PictureDenoiseFilter: 'off',
                PictureDetelecine: 'off',
                PictureDetelecineCustom: '',
                PictureForceHeight: 0,
                PictureForceWidth: 0,
                PictureItuPAR: false,
                PictureKeepRatio: true,
                PictureLeftCrop: 0,
                PicturePadBottom: 0,
                PicturePadLeft: 0,
                PicturePadMode: 'none',
                PicturePadRight: 0,
                PicturePadTop: 0,
                PicturePAR: 'auto',
                PicturePARHeight: 1,
                PicturePARWidth: 1,
                PictureRightCrop: 0,
                PictureSharpenCustom: '',
                PictureSharpenFilter: 'off',
                PictureSharpenPreset: 'medium',
                PictureSharpenTune: 'none',
                PictureTopCrop: 0,
                PictureUseMaximumSize: true,
                PresetDisabled: false,
                PresetName: presetName,
                SubtitleAddCC: encoder !== 'svt_av1',
                SubtitleAddForeignAudioSearch: false,
                SubtitleAddForeignAudioSubtitle: false,
                SubtitleBurnBDSub: false,
                SubtitleBurnBehavior: 'none',
                SubtitleBurnDVDSub: false,
                SubtitleLanguageList: ['any'],
                SubtitleTrackSelectionBehavior: 'all',
                Type: 1,
                VideoAvgBitrate: 0,
                VideoColorMatrixCode: 0,
                VideoEncoder: finalVideoEncoder,
                VideoFramerateMode: args.inputs.framerateMode,
                VideoGrayScale: false,
                ...(videoHWDecode && { VideoHWDecode: videoHWDecode }),
                VideoLevel: 'auto',
                VideoMultiPass: false,
                VideoOptionExtra: '',
                VideoPreset: videoPreset,
                VideoProfile: videoProfile,
                VideoQualitySlider: quality,
                VideoQualityType: 2,
                ...(videoQSVDecode && { VideoQSVDecode: videoQSVDecode }),
                VideoScaler: 'swscale',
                VideoTune: videoTune,
                VideoTurboMultiPass: false,
                x264UseAdvancedOptions: false
            }
        ],
        VersionMajor: 56,
        VersionMicro: 0,
        VersionMinor: 0
    };

    logger.debug('Generated preset JSON structure:');
    logger.debug(JSON.stringify(preset, null, 2));

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
        
        // Initialize logger with immediate logging
        const logger = new Logger(args.inputs.logging_level, args.jobLog);
        
        // Performance tracking
        const startTime = Date.now();
        let performanceTimer = null;
        
        if (args.inputs.showPerformanceMetrics) {
            performanceTimer = createTimer();
        }

        const processingMetrics = {
            initializationTime: 0,
            qaTime: 0,
            requirementsCheckTime: 0,
            presetGenerationTime: 0,
            encodingTime: 0,
            totalTime: 0
        };

        logger.banner('🎬 ENHANCED HANDBRAKE v4.0 STARTING');
        logger.section('DeNiX Enhanced HandBrake: Smart Encoder with Resolution & Bitrate Control');

        // ===============================================
        // STEP 1: INITIALIZATION AND VALIDATION
        // ===============================================
        
        logger.subsection('Step 1: Initialization and input validation');
        const initStartTime = Date.now();

        const useCustomPreset = Boolean(args.inputs.useCustomPreset);
        
        logger.info(`📁 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`🎛️ Mode: ${useCustomPreset ? 'Custom Preset' : 'Smart Mode'}`);
        logger.info(`📊 Container: ${args.inputFileObj.container}`);
        logger.info(`📐 Resolution: ${args.inputFileObj.video_resolution || 'Unknown'}`);

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

        // Enhanced input logging
        logger.extended(`Video encoder: ${args.inputs.videoEncoder}`);
        logger.extended(`10-bit encoding: ${args.inputs.tenBitEncoding}`);
        logger.extended(`Frame rate mode: ${args.inputs.framerateMode}`);
        logger.extended(`Bitrate filtering: ${args.inputs.enableBitrateFiltering}`);
        logger.extended(`Progress timeout: ${args.inputs.progressTimeoutMinutes} minutes`);

        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        
        logger.subsection('Step 2: Quality assurance and validation');
        const qaStartTime = Date.now();
        
        const validationResult = performQualityAssurance(args.inputFileObj, args.inputs, logger);
        if (!validationResult.canProcess) {
            logger.error(validationResult.errorMessage);
            
            const errorVariables = {
                ...args.variables,
                handbrake_completed: false,
                handbrake_success: false,
                handbrake_error: true,
                handbrake_error_message: validationResult.errorMessage,
                handbrake_error_type: 'qa_validation_failed',
                handbrake_processing_time: Date.now() - startTime,
                handbrake_platform: platformInfo.platform,
                handbrake_timestamp: new Date().toISOString(),
                handbrake_plugin_version: '4.0'
            };
            
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: errorVariables,
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
        // STEP 3: PRESET HANDLING
        // ===============================================
        
        let preset;
        
        if (useCustomPreset) {
            logger.subsection('Step 3: Custom preset processing');
            logger.info('Processing custom HandBrake preset...');
            
            const customPresetString = String(args.inputs.customPreset);
            if (!customPresetString || customPresetString.trim() === '') {
                const errorMsg = 'Custom preset mode enabled but no preset provided';
                logger.error(errorMsg);
                return {
                    outputFileObj: args.inputFileObj,
                    outputNumber: 3,
                    variables: args.variables,
                };
            }
            
            try {
                preset = JSON.parse(customPresetString);
                logger.extended(`Custom preset parsed successfully - ${customPresetString.length} characters`);
                
                if (!preset.PresetList || !Array.isArray(preset.PresetList) || preset.PresetList.length === 0) {
                    throw new Error('Invalid preset format: PresetList is missing or empty');
                }
                if (!preset.PresetList[0].PresetName) {
                    throw new Error('Invalid preset format: First preset is missing PresetName');
                }
                
                logger.success(`Custom preset validated: ${preset.PresetList[0].PresetName}`);
            } catch (e) {
                const errorMsg = `Invalid custom JSON preset: ${e.message}`;
                logger.error(errorMsg);
                
                const errorVariables = {
                    ...args.variables,
                    handbrake_completed: false,
                    handbrake_success: false,
                    handbrake_error: true,
                    handbrake_error_message: errorMsg,
                    handbrake_error_type: 'custom_preset_parse_error',
                    handbrake_processing_time: Date.now() - startTime,
                    handbrake_platform: platformInfo.platform,
                    handbrake_timestamp: new Date().toISOString(),
                    handbrake_plugin_version: '4.0'
                };
                
                return {
                    outputFileObj: args.inputFileObj,
                    outputNumber: 3,
                    variables: errorVariables,
                };
            }
            
        } else {
            logger.subsection('Step 3: Smart mode analysis and preset generation');
            
            // Check file requirements
            const requirementsStartTime = Date.now();
            const fileCheck = checkFileRequirements(args, args.inputFileObj, logger);
            processingMetrics.requirementsCheckTime = Date.now() - requirementsStartTime;
            
            logger.extended(`File requirements check: ${fileCheck.reason}`);
            
            if (fileCheck.shouldSkip) {
                logger.success(`File optimization not needed: ${fileCheck.reason}`);
                
                // Enhanced variables for skipped files
                const updatedVariables = {
                    ...args.variables,
                    handbrake_skipped: true,
                    handbrake_skip_reason: fileCheck.reason,
                    handbrake_processing_time: Date.now() - startTime,
                    handbrake_platform: platformInfo.platform,
                    handbrake_handbrake_path: handbrakePath,
                    handbrake_handbrake_version: handbrakeVersion.version,
                    handbrake_plugin_version: '4.0'
                };

                args.logOutcome('tSuc');
                return {
                    outputFileObj: args.inputFileObj,
                    outputNumber: 2,
                    variables: updatedVariables,
                };
            }
            
            // Generate smart preset
            const presetStartTime = Date.now();
            const resolution = args.inputFileObj.video_resolution;
            const resolutionTier = detectResolutionTier(resolution);
            
            logger.info(`Resolution analysis: ${resolution || 'Unknown'} → ${resolutionTier.name}`);
            
            try {
                preset = generatePreset(args, resolutionTier, logger);
                logger.success(`Smart preset generated for ${args.inputs.videoEncoder} with CRF ${preset.PresetList[0].VideoQualitySlider}`);
                processingMetrics.presetGenerationTime = Date.now() - presetStartTime;
            } catch (error) {
                logger.error(`Failed to generate preset: ${error.message}`);
                
                const errorVariables = {
                    ...args.variables,
                    handbrake_completed: false,
                    handbrake_success: false,
                    handbrake_error: true,
                    handbrake_error_message: `Failed to generate preset: ${error.message}`,
                    handbrake_error_type: 'preset_generation_failed',
                    handbrake_processing_time: Date.now() - startTime,
                    handbrake_platform: platformInfo.platform,
                    handbrake_timestamp: new Date().toISOString(),
                    handbrake_plugin_version: '4.0'
                };
                
                return {
                    outputFileObj: args.inputFileObj,
                    outputNumber: 3,
                    variables: errorVariables,
                };
            }
        }

        // ===============================================
        // STEP 4: HANDBRAKE EXECUTION SETUP
        // ===============================================
        
        logger.subsection('Step 4: HandBrake execution setup and processing');
        const encodingStartTime = Date.now();
        
        // Determine container format from preset
        let container = 'mkv';
        const firstPreset = preset.PresetList[0];
        logger.debug(`Determining container format from preset FileFormat: ${firstPreset.FileFormat}`);
        
        if (firstPreset.FileFormat) {
            switch (firstPreset.FileFormat.toLowerCase()) {
                case 'av_mkv':
                case 'mkv':
                    container = 'mkv';
                    break;
                case 'av_mp4':
                case 'mp4':
                    container = 'mp4';
                    break;
                case 'av_webm':
                case 'webm':
                    container = 'webm';
                    break;
                default:
                    container = 'mkv';
                    logger.warn(`Unknown container format in preset: ${firstPreset.FileFormat}, defaulting to mkv`);
            }
        }
        
        logger.extended(`Selected container format: ${container}`);
        
        // Generate output file path
        const outputFilePath = `${(0, fileUtils_1.getPluginWorkDir)(args)}/${(0, fileUtils_1.getFileName)(args.inputFileObj._id)}.${container}`;
        logger.extended(`Generated output file path: ${outputFilePath}`);
        
        // Write preset to temporary file
        const presetPath = path.join(args.workDir, 'denix_enhanced_handbrake_preset.json');
        logger.debug(`Preset will be written to: ${presetPath}`);
        
        try {
            yield fs.promises.writeFile(presetPath, JSON.stringify(preset, null, 2));
            logger.debug(`Preset written to: ${presetPath}`);
            
            const stats = yield fs.promises.stat(presetPath);
            logger.extended(`Preset file size: ${formatFileSize(stats.size)}`);
        } catch (error) {
            const errorMsg = `Failed to write preset file: ${error.message}`;
            logger.error(errorMsg);
            
            const errorVariables = {
                ...args.variables,
                handbrake_completed: false,
                handbrake_success: false,
                handbrake_error: true,
                handbrake_error_message: errorMsg,
                handbrake_error_type: 'preset_file_write_failed',
                handbrake_processing_time: Date.now() - startTime,
                handbrake_platform: platformInfo.platform,
                handbrake_timestamp: new Date().toISOString(),
                handbrake_plugin_version: '4.0'
            };
            
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: errorVariables,
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
        
        logger.info(`Using HandBrake preset: ${preset.PresetList[0].PresetName}`);
        logger.info(`Output container: ${container}`);
        logger.extended(`HandBrake path: ${handbrakePath}`);
        logger.extended(`CLI arguments: ${cliArguments.join(' ')}`);
        
        const progressTimeoutMinutes = Number(args.inputs.progressTimeoutMinutes) || 0;
        if (progressTimeoutMinutes > 0) {
            logger.info(`Progress timeout enabled: ${progressTimeoutMinutes} minutes`);
        } else {
            logger.extended('Progress timeout disabled');
        }

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

        logger.extended('CLI configuration created');

        // Create CLI instance
        const cliInstance = new CLI(cliConfig);
        logger.extended('CLI instance created');
        
        // Add progress timeout functionality
        let lastProgress = -1;
        let lastProgressTime = Date.now();
        let progressTimeoutId = null;
        
        logger.extended('Setting up enhanced progress monitoring...');
        
        // Override parseOutput for enhanced logging
        const originalParseOutput = cliInstance.parseOutput.bind(cliInstance);
        cliInstance.parseOutput = function(data) {
            const str = String(data);
            
            if (args.logFullCliOutput) {
                logger.info(`🔧 HB: ${str.trim()}`);
            }
            
            // Enhanced debug logging
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
                        logger.progress(`Encoding progress: ${currentProgress}%`);
                        logger.debug(`Progress updated: ${currentProgress}%`);
                    }
                }
            }
        };
        
        // Progress timeout check
        const checkProgressTimeout = () => {
            if (progressTimeoutMinutes <= 0) return;
            
            const now = Date.now();
            const timeSinceLastProgress = (now - lastProgressTime) / 1000 / 60;
            
            if (timeSinceLastProgress >= progressTimeoutMinutes && lastProgress >= 0) {
                logger.warn(`Progress stuck at ${lastProgress}% for ${Math.round(timeSinceLastProgress * 10) / 10} minutes - terminating process`);
                logger.debug(`Progress timeout triggered - killing HandBrake process`);
                cliInstance.cancelled = true;
                cliInstance.killThread();
            }
        };
        
        if (progressTimeoutMinutes > 0) {
            progressTimeoutId = setInterval(checkProgressTimeout, 10000);
            logger.extended(`Progress timeout monitoring started (check every 10 seconds)`);
        }
        
        // ===============================================
        // STEP 5: HANDBRAKE EXECUTION
        // ===============================================
        
        logger.info('🎬 Starting HandBrake encoding process...');
        logger.extended('Launching HandBrake CLI process...');
        
        let res;
        try {
            res = yield cliInstance.runCli();
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
        // STEP 6: OUTPUT VERIFICATION AND CLEANUP
        // ===============================================
        
        logger.subsection('Step 6: Output verification and cleanup');
        
        // Check output file
        logger.extended('Checking if output file was created...');
        let outputFileExists = false;
        let outputFileSize = 0;
        try {
            yield fs.promises.access(outputFilePath);
            outputFileExists = true;
            const stats = yield fs.promises.stat(outputFilePath);
            outputFileSize = stats.size;
            logger.success(`Output file created successfully. Size: ${formatFileSize(outputFileSize)}`);
            logger.extended(`Output file exact size: ${outputFileSize} bytes`);
        } catch (error) {
            logger.error(`Output file check failed: ${error.message}`);
            logger.debug(`Output file access error: ${error.stack}`);
        }
        
        // Clean up preset file
        logger.extended('Cleaning up temporary preset file...');
        try {
            yield fs.promises.unlink(presetPath);
            logger.debug('Temporary preset file cleaned up');
        } catch (error) {
            logger.warn(`Warning - Failed to clean up preset file: ${error.message}`);
            logger.debug(`Cleanup error details: ${error.stack}`);
        }
        
        // Handle cancellation
        if (cliInstance.cancelled) {
            const errorMsg = `HandBrake was cancelled (likely due to progress timeout)`;
            logger.error(errorMsg);
            logger.debug('Process was cancelled by timeout mechanism');
            
            const errorVariables = {
                ...args.variables,
                handbrake_completed: false,
                handbrake_success: false,
                handbrake_error: true,
                handbrake_error_message: errorMsg,
                handbrake_error_type: 'process_cancelled_timeout',
                handbrake_processing_time: Date.now() - startTime,
                handbrake_platform: platformInfo.platform,
                handbrake_last_progress: lastProgress,
                handbrake_timeout_minutes: progressTimeoutMinutes,
                handbrake_timestamp: new Date().toISOString(),
                handbrake_plugin_version: '4.0'
            };
            
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: errorVariables,
            };
        }
        
        // Check exit code
        const exitCode = res.cliExitCode;
        const isSuccess = isSuccessfulExitCode(exitCode);
        
        logger.debug(`Exit code analysis: ${exitCode}, isSuccess: ${isSuccess}`);
        
        if (!isSuccess) {
            const errorMsg = `HandBrake failed with exit code ${exitCode}`;
            logger.error(errorMsg);
            logger.debug(`Exit code ${exitCode} is not in the list of acceptable codes: [0, 3221226356, 3221225786]`);
            
            const errorVariables = {
                ...args.variables,
                handbrake_completed: true,
                handbrake_success: false,
                handbrake_error: true,
                handbrake_error_message: errorMsg,
                handbrake_error_type: 'handbrake_exit_code_failure',
                handbrake_exit_code: exitCode,
                handbrake_processing_time: Date.now() - startTime,
                handbrake_platform: platformInfo.platform,
                handbrake_timestamp: new Date().toISOString(),
                handbrake_plugin_version: '4.0'
            };
            
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: errorVariables,
            };
        } else if (exitCode !== 0) {
            logger.warn(`HandBrake completed with non-zero exit code ${exitCode} (Windows cleanup issue - treating as success)`);
        }
        
        // Verify output
        if (!outputFileExists) {
            const errorMsg = 'HandBrake completed but output file was not created';
            logger.error(errorMsg);
            logger.debug('Output file verification failed - file does not exist');
            
            const errorVariables = {
                ...args.variables,
                handbrake_completed: true,
                handbrake_success: false,
                handbrake_error: true,
                handbrake_error_message: errorMsg,
                handbrake_error_type: 'output_file_missing',
                handbrake_exit_code: exitCode,
                handbrake_expected_output: outputFilePath,
                handbrake_processing_time: Date.now() - startTime,
                handbrake_platform: platformInfo.platform,
                handbrake_timestamp: new Date().toISOString(),
                handbrake_plugin_version: '4.0'
            };
            
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: errorVariables,
            };
        }
        
        if (outputFileSize < 1024) {
            const errorMsg = `Output file is suspiciously small (${formatFileSize(outputFileSize)}) - possible encoding failure`;
            logger.error(errorMsg);
            logger.debug('Output file size check failed - file too small');
            
            const errorVariables = {
                ...args.variables,
                handbrake_completed: true,
                handbrake_success: false,
                handbrake_error: true,
                handbrake_error_message: errorMsg,
                handbrake_error_type: 'output_file_too_small',
                handbrake_exit_code: exitCode,
                handbrake_output_size: outputFileSize,
                handbrake_output_file: outputFilePath,
                handbrake_processing_time: Date.now() - startTime,
                handbrake_platform: platformInfo.platform,
                handbrake_timestamp: new Date().toISOString(),
                handbrake_plugin_version: '4.0'
            };
            
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: errorVariables,
            };
        }

        // ===============================================
        // STEP 7: FINAL ANALYSIS AND REPORTING
        // ===============================================
        
        processingMetrics.totalTime = Date.now() - startTime;

        logger.subsection('Step 7: Final analysis and comprehensive reporting');

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
            logger.extended(`⏱️ Requirements check: ${processingMetrics.requirementsCheckTime}ms`);
            logger.extended(`⏱️ Preset generation: ${processingMetrics.presetGenerationTime}ms`);
            logger.extended(`⏱️ Encoding process: ${processingMetrics.encodingTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            // Calculate encoding efficiency
            if (originalSize > 0 && processingMetrics.encodingTime > 0) {
                const mbProcessed = originalSize / (1024 * 1024);
                const secondsElapsed = processingMetrics.encodingTime / 1000;
                const efficiency = mbProcessed / secondsElapsed;
                logger.extended(`📈 Encoding efficiency: ${efficiency.toFixed(2)} MB/second`);
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
                { name: 'Custom preset mode', enabled: useCustomPreset },
                { name: 'Smart mode', enabled: !useCustomPreset },
                { name: 'Bitrate filtering', enabled: args.inputs.enableBitrateFiltering },
                { name: '10-bit encoding', enabled: args.inputs.tenBitEncoding },
                { name: 'Progress timeout', enabled: progressTimeoutMinutes > 0 },
                { name: 'Quality assurance', enabled: args.inputs.enable_qa_checks },
                { name: 'Performance metrics', enabled: args.inputs.showPerformanceMetrics }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`🎬 Video encoder: ${args.inputs.videoEncoder}`);
            logger.debug(`📦 Output container: ${container}`);
            logger.debug(`🎬 HandBrake version: ${handbrakeVersion.version}`);
            logger.debug(`🖥️ Platform: ${platformInfo.platform}`);
            logger.debug(`⚙️ Exit code: ${exitCode}`);
            logger.debug(`📊 Compression ratio: ${compressionRatio.toFixed(3)}`);
            logger.debug(`📁 HandBrake path: ${handbrakePath}`);
        }

        // Enhanced variables with comprehensive information
        const updatedVariables = {
            ...args.variables,
            
            // Encoding results
            handbrake_completed: true,
            handbrake_success: true,
            handbrake_skipped: false,
            handbrake_mode: useCustomPreset ? 'custom' : 'smart',
            
            // File information
            handbrake_input_file: args.inputFileObj._id,
            handbrake_output_file: outputFilePath,
            handbrake_input_size: originalSize,
            handbrake_output_size: outputFileSize,
            handbrake_container: container,
            
            // Encoding settings
            handbrake_encoder: args.inputs.videoEncoder,
            handbrake_preset_name: preset.PresetList[0].PresetName,
            handbrake_quality: preset.PresetList[0].VideoQualitySlider,
            handbrake_10bit: args.inputs.tenBitEncoding,
            handbrake_framerate_mode: args.inputs.framerateMode,
            
            // Compression analysis
            handbrake_compression_ratio: compressionRatio,
            handbrake_space_saved: spaceSaved,
            handbrake_compression_percent: compressionPercent,
            
            // Performance metadata
            handbrake_processing_time: processingMetrics.totalTime,
            handbrake_encoding_time: processingMetrics.encodingTime,
            handbrake_exit_code: exitCode,
            
            // System and diagnostics information
            handbrake_platform: platformInfo.platform,
            handbrake_handbrake_path: handbrakePath,
            handbrake_handbrake_version: handbrakeVersion.version,
            handbrake_handbrake_build: handbrakeVersion.buildDate,
            handbrake_handbrake_arch: handbrakeVersion.architecture,
            handbrake_timestamp: new Date().toISOString(),
            handbrake_plugin_version: '4.0'
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
            
            // Quality score calculation
            let qualityScore = 100;
            if (exitCode !== 0) qualityScore -= 10;
            if (outputFileSize < 1024 * 1024) qualityScore -= 20; // Very small file
            if (compressionRatio > 2) qualityScore -= 5; // Excessive compression
            if (validationResult.warnings.length > 0) qualityScore -= validationResult.warnings.length * 5;
            if (handbrakeVersion.error) qualityScore -= 15; // HandBrake detection issues
            qualityScore = Math.max(0, qualityScore);
            
            logger.extended(`📊 Encoding quality score: ${qualityScore}/100`);
        }

        // Log comprehensive summary
        logger.banner('🎉 ENCODING COMPLETED SUCCESSFULLY');
        
        if (useCustomPreset) {
            logger.success('📊 Custom Preset Mode Summary:');
            logger.success(`  📄 Preset: ${preset.PresetList[0].PresetName}`);
            logger.success(`  📦 Container: ${container}`);
        } else {
            logger.success('📊 Smart Mode Summary:');
            const resolution = args.inputFileObj.video_resolution;
            const resolutionTier = detectResolutionTier(resolution);
            logger.success(`  📐 Resolution: ${resolution} (${resolutionTier.name})`);
            logger.success(`  🎬 Encoder: ${args.inputs.videoEncoder}`);
            logger.success(`  🎯 Quality: CRF ${preset.PresetList[0].VideoQualitySlider}`);
            logger.success(`  🌈 10-bit: ${args.inputs.tenBitEncoding ? 'Yes' : 'No'}`);
            logger.success(`  📦 Container: ${container}`);
            logger.success(`  🎬 Frame Rate: ${args.inputs.framerateMode.toUpperCase()}`);
        }
        
        logger.success(`🎬 HandBrake Version: ${handbrakeVersion.version}`);
        logger.success(`📁 Output: ${path.basename(outputFilePath)}`);
        logger.success(`📊 Size: ${formatFileSize(originalSize)} → ${formatFileSize(outputFileSize)}`);
        
        if (compressionPercent > 0) {
            logger.success(`💾 Space saved: ${formatFileSize(spaceSaved)} (${compressionPercent.toFixed(1)}% reduction)`);
        } else if (compressionPercent < 0) {
            logger.info(`📈 Size increased: ${formatFileSize(Math.abs(spaceSaved))} (${Math.abs(compressionPercent).toFixed(1)}% larger)`);
        }
        
        logger.success(`⏱️ Processing time: ${formatDuration(processingMetrics.totalTime / 1000)}`);
        
        // Recommendations and insights
        logger.subsection('Recommendations and Insights');
        
        if (compressionPercent > 50) {
            logger.success('🌟 Excellent compression achieved - significant space savings');
        } else if (compressionPercent > 20) {
            logger.success('👍 Good compression achieved');
        } else if (compressionPercent < -10) {
            logger.info('💡 File size increased - consider reviewing quality settings');
        }
        
        if (processingMetrics.encodingTime > 3600000) { // > 1 hour
            logger.info('⏱️ Long encoding time - consider using hardware acceleration if available');
        }
        
        if (!useCustomPreset && args.inputs.enableBitrateFiltering) {
            logger.info('🎯 Smart mode with bitrate filtering is working optimally');
        }
        
        // System-specific recommendations
        if (handbrakeVersion.error) {
            logger.warn('⚠️ HandBrake version detection failed - consider updating HandBrake for better performance');
        }
        
        logger.success('✅ Enhanced HandBrake encoding complete!');
        logger.info('🎯 File is ready for use and distribution');
        logger.banner('🚀 ENCODING PROCESS COMPLETED SUCCESSFULLY');

        args.logOutcome('tSuc');
        return {
            outputFileObj: { _id: outputFilePath },
            outputNumber: 1,
            variables: updatedVariables,
        };

    } catch (error) {
        // For error logging, log immediately using args.jobLog directly
        args.jobLog(`❌ Plugin execution failed: ${error.message}`);
        if (error.stack && args.inputs && args.inputs.logging_level === 'debug') {
            args.jobLog(`🔍 Stack trace: ${error.stack}`);
        }
        
        const errorVariables = {
            ...args.variables,
            handbrake_completed: false,
            handbrake_success: false,
            handbrake_error: true,
            handbrake_error_message: error.message,
            handbrake_error_type: 'unexpected_exception',
            handbrake_error_stack: error.stack,
            handbrake_processing_time: startTime ? Date.now() - startTime : 0,
            handbrake_timestamp: new Date().toISOString(),
            handbrake_plugin_version: '4.0'
        };
        
        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 3,
            variables: errorVariables,
        };
    }
});

exports.plugin = plugin;