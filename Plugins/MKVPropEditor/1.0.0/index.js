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

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details
const details = () => ({
    name: '📊 DeNiX Enhanced MKVPropEdit: Metadata & Statistics Manager',
    description: 'Advanced MKVPropEdit wrapper with enhanced logging, validation, and comprehensive metadata management. Updates stream statistics, track properties, and metadata that FFmpeg cannot modify. Features intelligent error handling and detailed progress tracking.',
    style: {
        borderColor: '#9C27B0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        // Enhanced bright purple glow with 10 layers - expanded reach with graduated opacity
        boxShadow: `
            0 0 10px rgba(156, 39, 176, 0.5),
            0 0 25px rgba(156, 39, 176, 0.46),
            0 0 40px rgba(156, 39, 176, 0.42),
            0 0 55px rgba(156, 39, 176, 0.39),
            0 0 70px rgba(156, 39, 176, 0.35),
            0 0 85px rgba(156, 39, 176, 0.31),
            0 0 100px rgba(156, 39, 176, 0.27),
            0 0 115px rgba(156, 39, 176, 0.23),
            0 0 130px rgba(156, 39, 176, 0.19),
            0 0 145px rgba(156, 39, 176, 0.17),
            0 0 160px rgba(156, 39, 176, 0.15),
            inset 0 0 20px rgba(156, 39, 176, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.15))',
    },
    tags: 'mkvpropedit,metadata,statistics,matroska,mkv,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '📊',
    inputs: [
        {
            label: '⚙️ MKVPropEdit Arguments',
            name: 'mkvpropEditArgs',
            type: 'string',
            defaultValue: '--add-track-statistics-tags --parse-mode full',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Arguments to pass to mkvpropedit (without filename). Common: --add-track-statistics-tags, --parse-mode full, --edit info --set title="New Title"',
        },
        {
            label: '🛠️ MKVPropEdit Path (Windows)',
            name: 'mkvpropEditPathWindows',
            type: 'string',
            defaultValue: 'mkvpropedit.exe',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Path to mkvpropedit binary on Windows. Use "mkvpropedit.exe" if in PATH, or full path like "C:\\Program Files\\MKVToolNix\\mkvpropedit.exe"',
        },
        {
            label: '🛠️ MKVPropEdit Path (Linux)',
            name: 'mkvpropEditPathLinux',
            type: 'string',
            defaultValue: 'mkvpropedit',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Path to mkvpropedit binary on Linux. Use "mkvpropedit" if in PATH, or full path like "/usr/bin/mkvpropedit"',
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
            label: '⏱️ Show Performance Metrics',
            name: 'showPerformanceMetrics',
            type: 'boolean',
            defaultValue: false,
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Display processing timing and performance statistics',
        },

    ],
    outputs: [
        {
            number: 1,
            tooltip: '✅ Continue to next plugin - MKVPropEdit completed successfully',
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

// Detect operating system
const detectOS = () => {
    const platform = process.platform;
    if (platform === 'win32') return 'windows';
    if (platform === 'linux') return 'linux';
    if (platform === 'darwin') return 'mac';
    return 'unknown';
};

// Parse and validate MKVPropEdit arguments
const parseAndValidateArgs = (argsString) => {
    const result = {
        isValid: true,
        args: [],
        warnings: [],
        errors: []
    };

    try {
        // Split arguments respecting quoted strings
        const args = argsString.trim().split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        
        // Common argument patterns and validation
        const validPatterns = [
            /^--add-track-statistics-tags$/,
            /^--parse-mode$/,
            /^--edit$/,
            /^--set$/,
            /^--delete$/,
            /^--add$/,
            /^--replace$/,
            /^info$/,
            /^track:\d+$/,
            /^segment-info$/,
            /^title=.+$/,
            /^language=.+$/,
            /^name=.+$/,
            /^full$/,
            /^fast$/
        ];

        for (const arg of args) {
            if (arg.trim()) {
                result.args.push(arg.trim());
                
                // Basic validation
                if (arg.startsWith('--')) {
                    // Check for potentially dangerous operations
                    if (arg.includes('--delete') && !arg.includes('--delete-track-statistics-tags')) {
                        result.warnings.push(`Potentially destructive operation: ${arg}`);
                    }
                }
            }
        }

        // Check for common mistakes
        if (result.args.includes('--edit') && !result.args.some(arg => arg.includes('info') || arg.includes('track:'))) {
            result.warnings.push('--edit specified without target (info/track)');
        }

        if (result.args.includes('--set') && !result.args.includes('--edit')) {
            result.warnings.push('--set specified without --edit');
        }

    } catch (error) {
        result.isValid = false;
        result.errors.push(`Argument parsing error: ${error.message}`);
    }

    return result;
};

// Analyze MKV file properties
const analyzeMKVFile = (inputFileObj) => {
    const analysis = {
        hasVideoTracks: false,
        hasAudioTracks: false,
        hasSubtitleTracks: false,
        trackCount: 0,
        estimatedDuration: null,
        fileSize: null
    };

    try {
        if (inputFileObj.ffProbeData?.streams) {
            analysis.trackCount = inputFileObj.ffProbeData.streams.length;
            
            inputFileObj.ffProbeData.streams.forEach(stream => {
                switch (stream.codec_type) {
                    case 'video':
                        analysis.hasVideoTracks = true;
                        break;
                    case 'audio':
                        analysis.hasAudioTracks = true;
                        break;
                    case 'subtitle':
                        analysis.hasSubtitleTracks = true;
                        break;
                }
            });

            if (inputFileObj.ffProbeData.format?.duration) {
                analysis.estimatedDuration = parseFloat(inputFileObj.ffProbeData.format.duration);
            }

            if (inputFileObj.ffProbeData.format?.size) {
                analysis.fileSize = parseInt(inputFileObj.ffProbeData.format.size);
            }
        }
    } catch (error) {
        // Silent fail for analysis errors
    }

    return analysis;
};

// Format duration helper
const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
};

// Format file size helper
const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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

        logger.section('DeNiX Enhanced MKVPropEdit: Metadata & Statistics Manager');
        logger.info(`🎬 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`📦 Container: ${args.inputFileObj.container}`);

        // ===============================================
        // STEP 1: OS DETECTION AND PATH SELECTION
        // ===============================================
        
        logger.subsection('Step 1: OS detection and binary path selection');

        const detectedOS = detectOS();
        logger.info(`🖥️ Detected OS: ${detectedOS}`);

        let mkvpropEditPath;
        if (detectedOS === 'windows') {
            mkvpropEditPath = args.inputs.mkvpropEditPathWindows || 'mkvpropedit.exe';
            logger.info(`Using Windows path: ${mkvpropEditPath}`);
        } else if (detectedOS === 'linux' || detectedOS === 'mac') {
            mkvpropEditPath = args.inputs.mkvpropEditPathLinux || 'mkvpropedit';
            logger.info(`Using Linux/Unix path: ${mkvpropEditPath}`);
        } else {
            logger.warn(`Unknown OS detected, defaulting to: mkvpropedit`);
            mkvpropEditPath = 'mkvpropedit';
        }

        // ===============================================
        // STEP 2: FILE ANALYSIS
        // ===============================================
        
        logger.subsection('Step 2: File analysis');

        // Analyze MKV file
        const fileAnalysis = analyzeMKVFile(args.inputFileObj);
        
        if (['extended', 'debug'].includes(args.inputs.logging_level)) {
            logger.extended(`Track count: ${fileAnalysis.trackCount}`);
            logger.extended(`Video tracks: ${fileAnalysis.hasVideoTracks ? 'Yes' : 'No'}`);
            logger.extended(`Audio tracks: ${fileAnalysis.hasAudioTracks ? 'Yes' : 'No'}`);
            logger.extended(`Subtitle tracks: ${fileAnalysis.hasSubtitleTracks ? 'Yes' : 'No'}`);
            logger.extended(`Duration: ${formatDuration(fileAnalysis.estimatedDuration)}`);
            logger.extended(`File size: ${formatFileSize(fileAnalysis.fileSize)}`);
        }

        // ===============================================
        // STEP 3: ARGUMENT PARSING AND VALIDATION
        // ===============================================
        
        logger.subsection('Step 3: Argument parsing and validation');

        const userArgs = args.inputs.mkvpropEditArgs?.trim() || '--add-track-statistics-tags --parse-mode full';
        logger.debug(`🔍 Raw arguments: ${userArgs}`);

        const argValidation = parseAndValidateArgs(userArgs);
        
        if (!argValidation.isValid) {
            logger.error('Invalid MKVPropEdit arguments provided');
            argValidation.errors.forEach(error => logger.error(error));
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

        if (argValidation.warnings.length > 0) {
            argValidation.warnings.forEach(warning => logger.warn(warning));
        }

        logger.success(`Parsed ${argValidation.args.length} valid arguments`);
        logger.extended(`Final arguments: ${argValidation.args.join(' ')}`);

        // ===============================================
        // STEP 4: MKVPROPEDIT EXECUTION
        // ===============================================
        
        logger.subsection('Step 4: Executing MKVPropEdit');

        // Build complete command arguments
        const cliArgs = [...argValidation.args, args.inputFileObj._id];

        logger.info(`🔧 Executing: ${mkvpropEditPath} ${argValidation.args.join(' ')}`);
        logger.extended(`Full command: ${mkvpropEditPath} ${cliArgs.join(' ')}`);

        // Execute MKVPropEdit
        const cli = new cliUtils_1.CLI({
            cli: mkvpropEditPath,
            spawnArgs: cliArgs,
            spawnOpts: {},
            jobLog: args.jobLog,
            outputFilePath: '',
            inputFileObj: args.inputFileObj,
            logFullCliOutput: args.logFullCliOutput,
            updateWorker: args.updateWorker,
            args,
        });

        const res = yield cli.runCli();

        // ===============================================
        // STEP 5: RESULT ANALYSIS AND REPORTING
        // ===============================================
        
        logger.subsection('Step 5: Result analysis and reporting');

        let outputNumber = 1;
        const exitCode = res.cliExitCode;

        // Analyze exit codes
        if (exitCode === 0) {
            logger.success('MKVPropEdit completed successfully');
            logger.info('All metadata operations completed without errors');
        } else if (exitCode === 1) {
            logger.warn('MKVPropEdit completed with warnings (exit code 1)');
            logger.info('Operations completed but some warnings were encountered');
        } else if (exitCode === 2) {
            logger.error('MKVPropEdit failed with serious errors (exit code 2)');
            outputNumber = 3;
        } else {
            logger.error(`MKVPropEdit failed with unexpected exit code: ${exitCode}`);
            outputNumber = 3;
        }

        // Performance metrics
        const totalTime = Date.now() - startTime;
        if (args.inputs.showPerformanceMetrics && performanceTimer) {
            const executionTime = performanceTimer.stop();
            logger.extended(`⏱️ MKVPropEdit execution time: ${executionTime.toFixed(2)}ms`);
            logger.extended(`⏱️ Total processing time: ${totalTime}ms`);
            
            const efficiency = totalTime > 0 ? Math.round((fileAnalysis.fileSize / totalTime) / 1024) : 0;
            if (efficiency > 0) {
                logger.extended(`📈 Processing efficiency: ${efficiency} KB/ms`);
            }
        }

        // Feature utilization summary
        if (args.inputs.logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'OS Detection', enabled: true, value: detectedOS },
                { name: 'Performance metrics', enabled: args.inputs.showPerformanceMetrics }
            ];
            
            features.forEach(feature => {
                const status = feature.enabled ? '✅' : '❌';
                const value = feature.value ? ` (${feature.value})` : '';
                logger.debug(`${status} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}${value}`);
            });
            
            logger.debug(`🔧 Arguments processed: ${argValidation.args.length}`);
            logger.debug(`🎬 File tracks: ${fileAnalysis.trackCount}`);
            logger.debug(`⚙️ Exit code: ${exitCode}`);
        }

        // Enhanced variables
        const updatedVariables = {
            ...args.variables,
            mkvpropedit_exit_code: exitCode,
            mkvpropedit_success: exitCode <= 1,
            mkvpropedit_args_count: argValidation.args.length,
            mkvpropedit_track_count: fileAnalysis.trackCount,
            mkvpropedit_processing_time: totalTime,
            mkvpropedit_os: detectedOS
        };

        logger.success('✅ MKVPropEdit processing complete!');
        logger.info('=== End of Enhanced MKVPropEdit Processing ===');

        // Output all logs
        args.jobLog(logger.getOutput());

        if (exitCode > 1) {
            throw new Error(`MKVPropEdit failed with exit code: ${exitCode}`);
        }

        return {
            outputFileObj: args.inputFileObj,
            outputNumber: outputNumber,
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