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
const cliUtils_1 = require("../../../../FlowHelpers/1.0.0/cliUtils");
const fileUtils_1 = require("../../../../FlowHelpers/1.0.0/fileUtils");

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details
const details = () => ({
    name: '🩺 DeNiX Enhanced Health Check: Advanced File Validation',
    description: 'Comprehensive health check system with intelligent analysis modes, advanced logging, and detailed diagnostics. Supports quick HandBrake scans for metadata validation and thorough FFmpeg analysis for deep corruption detection with enhanced progress monitoring.',
    style: {
       borderColor: '#10B981',
       backgroundColor: 'rgba(16, 185, 129, 0.1)',
       borderWidth: '2px',
       borderStyle: 'solid',
       // Enhanced bright emerald glow with 10 layers - expanded reach with graduated opacity
       boxShadow: `
           0 0 10px rgba(16, 185, 129, 0.5),
           0 0 25px rgba(16, 185, 129, 0.46),
           0 0 40px rgba(16, 185, 129, 0.42),
           0 0 55px rgba(16, 185, 129, 0.39),
           0 0 70px rgba(16, 185, 129, 0.35),
           0 0 85px rgba(16, 185, 129, 0.31),
           0 0 100px rgba(16, 185, 129, 0.27),
           0 0 115px rgba(16, 185, 129, 0.23),
           0 0 130px rgba(16, 185, 129, 0.19),
           0 0 145px rgba(16, 185, 129, 0.17),
           0 0 160px rgba(16, 185, 129, 0.15),
           inset 0 0 20px rgba(16, 185, 129, 0.4)
       `,
       background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.15))',
    },
    tags: 'health-check,validation,analysis,corruption,diagnostic,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🩺',
    inputs: [
        {
            label: '🎯 Health Check Type',
            name: 'type',
            type: 'string',
            defaultValue: 'quick',
            inputUI: {
                type: 'dropdown',
                options: ['quick', 'thorough'],
            },
            tooltip: 'Quick: HandBrake scan (fast metadata check) | Thorough: FFmpeg analysis (full file decode for corruption detection)',
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
            tooltip: 'Logging detail level: info (basic), extended (detailed progress), debug (full diagnostics)',
        },
        {
            label: '⏰ Timeout (minutes)',
            name: 'progressTimeoutMinutes',
            type: 'number',
            defaultValue: 10,
            inputUI: {
                type: 'text',
            },
            tooltip: 'Maximum time for health check completion. Set to 0 for unlimited timeout.',
        },
        {
            label: '📈 Show Progress Updates',
            name: 'showProgress',
            type: 'boolean',
            defaultValue: true,
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Display periodic progress updates during analysis',
        },
        {
            label: '🔍 Deep Analysis Mode',
            name: 'deepAnalysis',
            type: 'boolean',
            defaultValue: false,
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Enable additional stream validation and metadata analysis (thorough mode only)',
        },
        {
            label: '📋 Generate Report',
            name: 'generateReport',
            type: 'boolean',
            defaultValue: false,
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Generate detailed health report with stream analysis and recommendations',
        },
        {
            label: '⏱️ Show Performance Metrics',
            name: 'showPerformanceMetrics',
            type: 'boolean',
            defaultValue: false,
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Display timing statistics and processing efficiency metrics',
        },
        {
            label: '🛠️ HandBrake Path (Linux/Mac)',
            name: 'handbrake_path_linux',
            type: 'string',
            defaultValue: 'HandBrakeCLI',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Path to HandBrake CLI binary for Linux/Mac. Examples: "HandBrakeCLI", "/usr/bin/HandBrakeCLI"',
        },
        {
            label: '🛠️ HandBrake Path (Windows)',
            name: 'handbrake_path_windows',
            type: 'string',
            defaultValue: 'HandBrakeCLI.exe',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Path to HandBrake CLI binary for Windows. Examples: "HandBrakeCLI.exe", "C:\\Program Files\\HandBrake\\HandBrakeCLI.exe"',
        },
        {
            label: '🛠️ FFmpeg Path (Linux/Mac)',
            name: 'ffmpeg_path_linux',
            type: 'string',
            defaultValue: 'ffmpeg',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Path to FFmpeg binary for Linux/Mac. Examples: "ffmpeg", "/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg"',
        },
        {
            label: '🛠️ FFmpeg Path (Windows)',
            name: 'ffmpeg_path_windows',
            type: 'string',
            defaultValue: 'ffmpeg.exe',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Path to FFmpeg binary for Windows. Examples: "ffmpeg.exe", "C:\\ffmpeg\\bin\\ffmpeg.exe"',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: '✅ Health check passed - File is healthy and valid',
        },
        {
            number: 2,
            tooltip: '❌ Health check failed - File has corruption or issues',
        },
        {
            number: 3,
            tooltip: '⚠️ Health check error - System or tool failure',
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

    progress(message) {
        this.output.push(`🔄 ${message}`);
    }

    health(message) {
        this.output.push(`🩺 ${message}`);
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

// Analyze file metadata
const analyzeFileMetadata = (inputFileObj) => {
    const analysis = {
        hasVideo: false,
        hasAudio: false,
        hasSubtitles: false,
        streamCount: 0,
        duration: null,
        bitrate: null,
        videoCodec: null,
        audioCodec: null,
        resolution: null,
        frameRate: null
    };

    try {
        if (inputFileObj.ffProbeData?.streams) {
            analysis.streamCount = inputFileObj.ffProbeData.streams.length;
            
            inputFileObj.ffProbeData.streams.forEach(stream => {
                switch (stream.codec_type) {
                    case 'video':
                        analysis.hasVideo = true;
                        if (!analysis.videoCodec) analysis.videoCodec = stream.codec_name;
                        if (stream.width && stream.height) {
                            analysis.resolution = `${stream.width}x${stream.height}`;
                        }
                        if (stream.r_frame_rate) {
                            const [num, den] = stream.r_frame_rate.split('/').map(Number);
                            if (den && den !== 0) {
                                analysis.frameRate = Math.round((num / den) * 100) / 100;
                            }
                        }
                        break;
                    case 'audio':
                        analysis.hasAudio = true;
                        if (!analysis.audioCodec) analysis.audioCodec = stream.codec_name;
                        break;
                    case 'subtitle':
                        analysis.hasSubtitles = true;
                        break;
                }
            });

            if (inputFileObj.ffProbeData.format) {
                if (inputFileObj.ffProbeData.format.duration) {
                    analysis.duration = parseFloat(inputFileObj.ffProbeData.format.duration);
                }
                if (inputFileObj.ffProbeData.format.bit_rate) {
                    analysis.bitrate = parseInt(inputFileObj.ffProbeData.format.bit_rate);
                }
            }
        }
    } catch (error) {
        // Silent fail for analysis errors
    }

    return analysis;
};

// Generate health report
const generateHealthReport = (analysis, checkType, result, processingTime) => {
    const report = [];
    
    report.push('📋 Health Check Report');
    report.push('═'.repeat(30));
    report.push(`Check Type: ${checkType.toUpperCase()}`);
    report.push(`Result: ${result}`);
    report.push(`Processing Time: ${formatDuration(processingTime)}`);
    report.push('');
    
    report.push('📊 File Analysis:');
    report.push(`• Stream Count: ${analysis.streamCount}`);
    report.push(`• Video: ${analysis.hasVideo ? `Yes (${analysis.videoCodec})` : 'No'}`);
    report.push(`• Audio: ${analysis.hasAudio ? `Yes (${analysis.audioCodec})` : 'No'}`);
    report.push(`• Subtitles: ${analysis.hasSubtitles ? 'Yes' : 'No'}`);
    
    if (analysis.resolution) {
        report.push(`• Resolution: ${analysis.resolution}`);
    }
    if (analysis.frameRate) {
        report.push(`• Frame Rate: ${analysis.frameRate} fps`);
    }
    if (analysis.duration) {
        report.push(`• Duration: ${formatDuration(analysis.duration)}`);
    }
    if (analysis.bitrate) {
        report.push(`• Bitrate: ${Math.round(analysis.bitrate / 1000)} kbps`);
    }
    
    report.push('');
    report.push('🎯 Recommendations:');
    if (result === 'PASSED') {
        report.push('• File appears healthy and ready for processing');
        if (checkType === 'quick') {
            report.push('• Consider thorough check for deeper analysis if issues occur');
        }
    } else {
        report.push('• File may require repair or re-encoding');
        report.push('• Check source media for corruption');
        if (checkType === 'quick') {
            report.push('• Run thorough check for detailed corruption analysis');
        }
    }
    
    return report.join('\n');
};

// Progress monitoring with timeout
const createProgressMonitor = (cli, logger, startTime, timeoutMinutes, showProgress) => {
    if (timeoutMinutes <= 0) return null;
    
    let progressInterval = null;
    
    const checkProgress = () => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000 / 60; // minutes
        
        if (showProgress && Math.floor(elapsed) % 2 === 0) {
            logger.progress(`Health check running for ${formatDuration(elapsed * 60)} (${timeoutMinutes} min limit)`);
        }
        
        if (elapsed >= timeoutMinutes) {
            logger.error(`Health check timeout after ${timeoutMinutes} minutes - terminating process`);
            cli.cancelled = true;
            cli.killThread();
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        }
    };
    
    progressInterval = setInterval(checkProgress, 30000); // Check every 30 seconds
    return progressInterval;
};

// ===============================================
// MAIN PLUGIN FUNCTION
// ===============================================

const plugin = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lib = require('../../../../../methods/lib')();
        const fs = require('fs');
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

        // Extract inputs
        const {
            type,
            progressTimeoutMinutes,
            showProgress,
            deepAnalysis,
            generateReport,
            showPerformanceMetrics
        } = args.inputs;

        logger.section('DeNiX Enhanced Health Check: Advanced File Validation');
        logger.health('Starting comprehensive health analysis');
        logger.info(`📁 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`🎯 Check Type: ${type.toUpperCase()}`);

        // ===============================================
        // STEP 1: FILE ANALYSIS AND PREPARATION
        // ===============================================
        
        logger.subsection('Step 1: File analysis and preparation');

        let fileStats = null;
        let fileAnalysis = null;

        try {
            fileStats = fs.statSync(args.inputFileObj._id);
            logger.extended(`File size: ${formatFileSize(fileStats.size)}`);
            
            fileAnalysis = analyzeFileMetadata(args.inputFileObj);
            logger.extended(`Streams: ${fileAnalysis.streamCount} (Video: ${fileAnalysis.hasVideo ? 'Yes' : 'No'}, Audio: ${fileAnalysis.hasAudio ? 'Yes' : 'No'})`);
            
            if (fileAnalysis.duration) {
                logger.extended(`Duration: ${formatDuration(fileAnalysis.duration)}`);
            }
            if (fileAnalysis.resolution) {
                logger.extended(`Resolution: ${fileAnalysis.resolution}`);
            }
        } catch (error) {
            logger.warn(`Could not read file stats: ${error.message}`);
        }

        if (progressTimeoutMinutes > 0) {
            logger.extended(`Timeout limit: ${progressTimeoutMinutes} minutes`);
        } else {
            logger.extended('Timeout: disabled (unlimited)');
        }

        // ===============================================
        // STEP 2: CONFIGURE HEALTH CHECK METHOD
        // ===============================================
        
        logger.subsection('Step 2: Configuring health check method');

        const outputFilePath = `${(0, fileUtils_1.getPluginWorkDir)(args)}/${(0, fileUtils_1.getFileName)(args.inputFileObj._id)}.${(0, fileUtils_1.getContainer)(args.inputFileObj._id)}`;
        
        let cliPath, cliArgs;

        if (type === 'quick') {
            // Get platform-specific HandBrake path
            cliPath = getPlatformSpecificPath(
                args.inputs.handbrake_path_linux,
                args.inputs.handbrake_path_windows
            );
            
            cliArgs = [
                '-i', args.inputFileObj._id,
                '-o', outputFilePath,
                '--scan'
            ];
            
            logger.info('🎬 Using HandBrake for quick health scan');
            logger.extended(`Tool path: ${cliPath}`);
            logger.extended('Quick scan: Analyzes file structure and metadata');
            logger.extended('Speed: Fast (seconds to minutes)');
            logger.extended('Detection: Basic corruption and accessibility issues');
        } else if (type === 'thorough') {
            // Get platform-specific FFmpeg path
            cliPath = getPlatformSpecificPath(
                args.inputs.ffmpeg_path_linux,
                args.inputs.ffmpeg_path_windows
            );
            
            cliArgs = [
                '-stats',
                '-v', 'error',
                '-i', args.inputFileObj._id,
                '-f', 'null'
            ];
            
            if (deepAnalysis) {
                cliArgs.push('-vf', 'blackdetect=d=2:pix_th=0.00');
                logger.extended('Deep analysis mode enabled - additional validation');
            }
            
            cliArgs.push('-max_muxing_queue_size', '9999', outputFilePath);
            
            logger.info('🎞️ Using FFmpeg for thorough health analysis');
            logger.extended(`Tool path: ${cliPath}`);
            logger.extended('Thorough scan: Decodes entire file for corruption detection');
            logger.extended('Speed: Comprehensive (minutes to hours)');
            logger.extended('Detection: Deep corruption analysis and stream validation');
        }

        logger.debug(`Command: ${cliPath} ${cliArgs.join(' ')}`);

        // ===============================================
        // STEP 3: EXECUTE HEALTH CHECK
        // ===============================================
        
        logger.subsection('Step 3: Executing health check');

        const cli = new cliUtils_1.CLI({
            cli: cliPath,
            spawnArgs: cliArgs,
            spawnOpts: {},
            jobLog: args.jobLog,
            outputFilePath,
            inputFileObj: args.inputFileObj,
            logFullCliOutput: args.logFullCliOutput,
            updateWorker: args.updateWorker,
            args,
        });

        // Setup progress monitoring
        const progressMonitor = createProgressMonitor(
            cli, 
            logger, 
            startTime, 
            progressTimeoutMinutes, 
            showProgress
        );

        if (progressMonitor) {
            logger.extended(`Timeout monitoring activated (${progressTimeoutMinutes} minute limit)`);
        }

        logger.progress(`Starting ${type} health analysis...`);

        let res;
        try {
            res = yield cli.runCli();
        } finally {
            // Clean up progress monitoring
            if (progressMonitor) {
                clearInterval(progressMonitor);
                logger.extended('Timeout monitoring disabled');
            }
        }

        const totalTime = (Date.now() - startTime) / 1000;

        // ===============================================
        // STEP 4: ANALYZE RESULTS
        // ===============================================
        
        logger.subsection('Step 4: Result analysis and reporting');

        // Check if cancelled due to timeout
        if (cli.cancelled) {
            logger.error('Health check was cancelled due to timeout');
            args.logOutcome?.('hErr');
            
            const updatedVariables = {
                ...args.variables,
                healthCheck: 'Timeout',
                healthCheckDuration: totalTime,
                healthCheckType: type
            };

            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: updatedVariables,
            };
        }

        logger.extended(`Analysis completed in ${formatDuration(totalTime)}`);

        // Update statistics if available
        if (typeof args.updateStat !== 'undefined') {
            yield args.updateStat(args.originalLibraryFile?.DB, 'totalHealthCheckCount', 1);
            logger.extended('Health check statistics updated');
        }

        let result, outputNumber;
        const updatedVariables = {
            ...args.variables,
            healthCheckDuration: totalTime,
            healthCheckType: type,
            healthCheckStreams: fileAnalysis?.streamCount || 0
        };

        if (res.cliExitCode !== 0) {
            result = 'FAILED';
            outputNumber = 2;
            
            logger.error(`Health check FAILED with exit code ${res.cliExitCode}`);
            logger.extended(`Processing time: ${formatDuration(totalTime)}`);
            
            if (type === 'quick') {
                logger.warn('Quick scan detected issues - file may be corrupted or inaccessible');
                logger.info('💡 Consider running thorough scan for detailed analysis');
            } else {
                logger.warn('Thorough scan detected corruption - file contains stream errors');
                logger.info('📋 File requires repair or re-encoding');
            }
            
            logger.info('🎯 Routing to error handling path (Output 2)');
            args.logOutcome?.('hErr');
            updatedVariables.healthCheck = 'Failed';
        } else {
            result = 'PASSED';
            outputNumber = 1;
            
            logger.success('Health check PASSED! File is healthy and valid');
            logger.extended(`${type.charAt(0).toUpperCase() + type.slice(1)} scan completed successfully`);
            logger.extended(`Total processing time: ${formatDuration(totalTime)}`);
            
            if (type === 'quick') {
                logger.success('📋 File structure and metadata are valid');
                logger.success('🎬 HandBrake can read file without issues');
            } else {
                logger.success('🎞️ File decoded successfully without stream errors');
                logger.success('🔬 No corruption detected in audio/video streams');
            }
            
            logger.info('🎯 Routing to success path (Output 1)');
            args.logOutcome?.('hSuc');
            updatedVariables.healthCheck = 'Success';
        }

        // Generate health report if requested
        if (generateReport && fileAnalysis) {
            logger.subsection('Health Report Generated');
            const report = generateHealthReport(fileAnalysis, type, result, totalTime);
            logger.extended('Full health report:');
            report.split('\n').forEach(line => {
                if (line.trim()) logger.extended(line);
            });
            updatedVariables.healthCheckReport = report;
        }

        // Performance metrics
        if (showPerformanceMetrics && performanceTimer) {
            const executionTime = performanceTimer.stop();
            logger.extended(`⏱️ Health check execution: ${executionTime.toFixed(2)}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime * 1000}ms`);
            
            if (fileStats) {
                const efficiency = totalTime > 0 ? Math.round((fileStats.size / totalTime) / 1024 / 1024) : 0;
                if (efficiency > 0) {
                    logger.extended(`📈 Processing efficiency: ${efficiency} MB/second`);
                }
            }
        }

        // Feature utilization summary
        if (args.inputs.logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Deep analysis', enabled: deepAnalysis && type === 'thorough' },
                { name: 'Progress monitoring', enabled: showProgress },
                { name: 'Report generation', enabled: generateReport },
                { name: 'Performance metrics', enabled: showPerformanceMetrics },
                { name: 'Timeout protection', enabled: progressTimeoutMinutes > 0 }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`🎯 Check type: ${type}`);
            logger.debug(`⚙️ Exit code: ${res.cliExitCode}`);
            logger.debug(`📊 File streams: ${fileAnalysis?.streamCount || 0}`);
        }

        logger.success('✅ Health check processing complete!');
        logger.info('=== End of Enhanced Health Check ===');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
            outputNumber,
            variables: updatedVariables,
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