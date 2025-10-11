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

// Plugin details
const details = () => ({
    name: '⚖️ DeNiX Enhanced File Comparison: Advanced Size & Duration Validation',
    description: 'Comprehensive file comparison system with intelligent ratio analysis, quality validation, advanced logging, and detailed metrics reporting. Features configurable thresholds, multi-dimensional validation, and comprehensive error analysis with performance monitoring.',
    style: {
       borderColor: '#06B6D4',
       backgroundColor: 'rgba(6, 182, 212, 0.1)',
       borderWidth: '2px',
       borderStyle: 'solid',
       boxShadow: `
           0 0 10px rgba(6, 182, 212, 0.5),
           0 0 25px rgba(6, 182, 212, 0.46),
           0 0 40px rgba(6, 182, 212, 0.42),
           inset 0 0 20px rgba(6, 182, 212, 0.4)
       `,
       background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.15))',
    },
    tags: 'comparison,validation,quality-control,size,duration,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '⚖️',
    inputs: [
        {
            label: '📏 Enable Size Validation',
            name: 'enableSizeCheck',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable comprehensive file size comparison and validation',
        },
        {
            label: '📐 Size Lower Bound (%)',
            name: 'sizeGreaterThan',
            type: 'number',
            defaultValue: 40,
            inputUI: { type: 'text' },
            tooltip: 'Minimum acceptable file size percentage. Default: 40% - new file must be at least 40% of original size.',
        },
        {
            label: '📐 Size Upper Bound (%)',
            name: 'sizeLessThan',
            type: 'number',
            defaultValue: 110,
            inputUI: { type: 'text' },
            tooltip: 'Maximum acceptable file size percentage. Default: 110% - new file must be at most 110% of original size.',
        },
        {
            label: '⏱️ Enable Duration Validation',
            name: 'enableDurationCheck',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable comprehensive duration comparison and validation',
        },
        {
            label: '⏳ Duration Lower Bound (%)',
            name: 'durationGreaterThan',
            type: 'number',
            defaultValue: 99.5,
            inputUI: { type: 'text' },
            tooltip: 'Minimum acceptable duration percentage. Default: 99.5% - new file duration must be at least 99.5% of original.',
        },
        {
            label: '⏳ Duration Upper Bound (%)',
            name: 'durationLessThan',
            type: 'number',
            defaultValue: 100.5,
            inputUI: { type: 'text' },
            tooltip: 'Maximum acceptable duration percentage. Default: 100.5% - new file duration must be at most 100.5% of original.',
        },
        {
            label: '🛡️ Enable Quality Assurance',
            name: 'enable_qa_checks',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable additional quality assurance checks and validation with detailed analysis',
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
        {
            label: '📋 Generate Detailed Report',
            name: 'generateReport',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Generate comprehensive comparison report with recommendations',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: '✅ All validation checks passed - File meets quality standards',
        },
        {
            number: 2,
            tooltip: '❌ Validation failed - File outside acceptable parameters',
        },
        {
            number: 3,
            tooltip: '⚠️ Error occurred during comparison process',
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
// ENHANCED HELPER FUNCTIONS
// ===============================================

// Safe number conversion with validation
const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return (typeof num === 'number' && !isNaN(num) && isFinite(num)) ? num : defaultValue;
};

// Safe toFixed wrapper
const safeToFixed = (value, decimals = 2, fallback = 'N/A') => {
    const num = safeNumber(value);
    return num !== 0 ? num.toFixed(decimals) : fallback;
};

// Format file size with precision
const formatSize = (bytes, precision = 2) => {
    const safeBytes = safeNumber(bytes, 0);
    if (safeBytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(safeBytes) / Math.log(1024));
    const value = safeBytes / Math.pow(1024, i);
    return `${safeToFixed(value, precision)} ${sizes[i]}`;
};

// Format duration with enhanced precision
const formatDuration = (seconds, showMilliseconds = false) => {
    const safeSeconds = safeNumber(seconds, 0);
    if (safeSeconds === 0) return '0s';
    
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;
    
    let result = '';
    if (hours > 0) {
        result += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
        result += `${minutes}m `;
    }
    
    if (showMilliseconds) {
        result += `${safeToFixed(secs, 3)}s`;
    } else {
        result += `${Math.floor(secs)}s`;
    }
    
    return result.trim();
};

// Enhanced file size extraction - UPDATED VERSION
const getFileSize = (fileObj, logger) => {
    try {
        logger.debug('Attempting to extract file size...');
        
        if (!fileObj) {
            logger.debug('File object is null or undefined');
            return 0;
        }
        
        logger.debug(`File object keys: ${Object.keys(fileObj).join(', ')}`);
        
        // PRIORITY 1: Read actual file size from disk (most reliable)
        if (fileObj._id) {
            try {
                const fs = require('fs');
                const stats = fs.statSync(fileObj._id);
                if (stats?.size && safeNumber(stats.size) > 0) {
                    const size = safeNumber(stats.size);
                    logger.debug(`File size extracted: ${size} bytes from fs.statSync (ACTUAL FILE SIZE)`);
                    return size;
                }
            } catch (fsError) {
                logger.debug(`Could not get file stats from _id: ${fsError.message}`);
            }
        }
        
        // PRIORITY 2: Try the 'file' property path (like the working plugin)
        if (fileObj.file) {
            try {
                const fs = require('fs');
                const stats = fs.statSync(fileObj.file);
                if (stats?.size && safeNumber(stats.size) > 0) {
                    const size = safeNumber(stats.size);
                    logger.debug(`File size extracted: ${size} bytes from fs.statSync(fileObj.file) (ACTUAL FILE SIZE)`);
                    return size;
                }
            } catch (fsError) {
                logger.debug(`Could not get file stats from file property: ${fsError.message}`);
            }
        }
        
        // PRIORITY 3: Try Tdarr's stored size values (may be outdated)
        const sizeLocations = [
            'statSync.size',
            'newSize',        // For processed files
            'oldSize',        // For original files
            'file_size',
            'size',
            'ffProbeData.format.size',
            'meta.size'
        ];
        
        for (const location of sizeLocations) {
            const keys = location.split('.');
            let value = fileObj;
            
            for (const key of keys) {
                value = value?.[key];
                if (value === undefined) break;
            }
            
            if (value && safeNumber(value) > 0) {
                const size = safeNumber(value);
                logger.debug(`File size extracted: ${size} bytes from ${location} (METADATA)`);
                return size;
            }
        }
        
        logger.warn('No valid file size found in any location');
        return 0;
    } catch (error) {
        logger.warn(`Error extracting file size: ${error.message}`);
        return 0;
    }
};

// Enhanced duration extraction
const getDuration = (fileObj, logger) => {
    try {
        if (!fileObj) {
            logger.debug('File object is null or undefined');
            return 0;
        }
        
        // Try multiple duration sources
        const durationSources = [
            'ffProbeData.format.duration',
            'meta.Duration',
            'duration'
        ];
        
        for (const source of durationSources) {
            const keys = source.split('.');
            let value = fileObj;
            
            for (const key of keys) {
                value = value?.[key];
                if (value === undefined) break;
            }
            
            if (value && safeNumber(value) > 0) {
                const duration = safeNumber(value);
                logger.debug(`Duration extracted: ${duration}s from ${source}`);
                return duration;
            }
        }
        
        // Try from streams
        if (fileObj?.ffProbeData?.streams) {
            for (const stream of fileObj.ffProbeData.streams) {
                if (stream.duration && safeNumber(stream.duration) > 0) {
                    const duration = safeNumber(stream.duration);
                    logger.debug(`Duration extracted: ${duration}s from stream data`);
                    return duration;
                }
            }
        }
        
        logger.debug('No valid duration found in file data');
        return 0;
    } catch (error) {
        logger.warn(`Error extracting duration: ${error.message}`);
        return 0;
    }
};

// Quality assurance validation
const performQualityAssurance = (inputFileObj, originalLibraryFile, inputs, logger) => {
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

        // Validate original library file
        if (!originalLibraryFile || !originalLibraryFile._id) {
            result.canProcess = false;
            result.errorMessage = 'Invalid original library file - missing file path';
            return result;
        }

        // Check file sizes exist (but don't fail if missing)
        const inputSize = getFileSize(inputFileObj, logger);
        const originalSize = getFileSize(originalLibraryFile, logger);
        
        if (inputSize === 0 || originalSize === 0) {
            result.warnings.push('Missing file size data - size comparison may be skipped');
        }

        // Validate threshold settings
        const sizeRange = safeNumber(inputs.sizeLessThan) - safeNumber(inputs.sizeGreaterThan);
        const durationRange = safeNumber(inputs.durationLessThan) - safeNumber(inputs.durationGreaterThan);
        
        if (inputs.enableSizeCheck && sizeRange <= 0) {
            result.canProcess = false;
            result.errorMessage = 'Invalid size range - upper bound must be greater than lower bound';
            return result;
        }

        if (inputs.enableDurationCheck && durationRange <= 0) {
            result.canProcess = false;
            result.errorMessage = 'Invalid duration range - upper bound must be greater than lower bound';
            return result;
        }

        // Check for reasonable threshold values
        if (inputs.enableSizeCheck) {
            if (safeNumber(inputs.sizeGreaterThan) < 1) {
                result.warnings.push('Very low size threshold may allow severely corrupted files');
            }
            if (safeNumber(inputs.sizeLessThan) > 200) {
                result.warnings.push('Very high size threshold may not catch encoding failures');
            }
        }

        logger.success('Quality assurance validation completed');

    } catch (error) {
        result.warnings.push(`QA check encountered error: ${error.message}`);
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
        const logger = new Logger(args.inputs.logging_level || 'info');
        
        // Performance tracking
        const startTime = Date.now();
        const processingMetrics = {
            initializationTime: 0,
            qaTime: 0,
            sizeAnalysisTime: 0,
            durationAnalysisTime: 0,
            totalTime: 0
        };

        logger.banner('⚖️ ENHANCED FILE COMPARISON v3.0 STARTING');
        logger.section('DeNiX Enhanced File Comparison: Advanced Size & Duration Validation');
        logger.info(`📁 Input File: ${path.basename(args.inputFileObj._id || 'unknown')}`);
        logger.info(`📂 Original File: ${path.basename(args.originalLibraryFile._id || 'unknown')}`);
        
        // Extract inputs with safe defaults
        const enableSizeCheck = args.inputs.enableSizeCheck === true || args.inputs.enableSizeCheck === 'true';
        const enableDurationCheck = args.inputs.enableDurationCheck === true || args.inputs.enableDurationCheck === 'true';
        const sizeGreaterThan = safeNumber(args.inputs.sizeGreaterThan, 40);
        const sizeLessThan = safeNumber(args.inputs.sizeLessThan, 110);
        const durationGreaterThan = safeNumber(args.inputs.durationGreaterThan, 99.5);
        const durationLessThan = safeNumber(args.inputs.durationLessThan, 100.5);
        const enableQA = args.inputs.enable_qa_checks === true || args.inputs.enable_qa_checks === 'true';
        const loggingLevel = args.inputs.logging_level || 'info';
        const showPerformanceMetrics = args.inputs.showPerformanceMetrics === true || args.inputs.showPerformanceMetrics === 'true';
        const generateReport = args.inputs.generateReport === true || args.inputs.generateReport === 'true';

        // ===============================================
        // STEP 1: INITIALIZATION AND CONFIGURATION
        // ===============================================
        
        logger.subsection('Step 1: Initialization and configuration validation');
        const initStartTime = Date.now();
        
        logger.extended(`Size validation: ${enableSizeCheck ? 'Enabled' : 'Disabled'}`);
        logger.extended(`Duration validation: ${enableDurationCheck ? 'Enabled' : 'Disabled'}`);
        
        if (enableSizeCheck) {
            logger.extended(`Size range: ${sizeGreaterThan}% - ${sizeLessThan}%`);
        }
        if (enableDurationCheck) {
            logger.extended(`Duration range: ${durationGreaterThan}% - ${durationLessThan}%`);
        }
        
        // Check if any validations are enabled
        if (!enableSizeCheck && !enableDurationCheck) {
            logger.warn('No validation checks enabled - defaulting to success');
            logger.info('Enable at least one check type to validate files');
            
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 1,
                variables: args.variables,
            };
        }
        
        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        
        logger.subsection('Step 2: Quality assurance and validation');
        const qaStartTime = Date.now();
        
        const validationResult = performQualityAssurance(
            args.inputFileObj, 
            args.originalLibraryFile, 
            { ...args.inputs, enable_qa_checks: enableQA },
            logger
        );
        
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
        
        processingMetrics.qaTime = Date.now() - qaStartTime;

        // ===============================================
        // STEP 3: FILE SIZE ANALYSIS
        // ===============================================
        
        let sizeAnalysis = null;
        
        if (enableSizeCheck) {
            logger.subsection('Step 3: File size analysis and validation');
            const sizeStartTime = Date.now();
            
            const originalSize = getFileSize(args.originalLibraryFile, logger);
            const newSize = getFileSize(args.inputFileObj, logger);
            
            // Check if we have valid file sizes
            if (originalSize === 0 || newSize === 0) {
                logger.warn('⚠️ Size validation skipped - file size data not available');
                logger.debug('This may occur if files are not properly scanned or size data is missing');
                
                sizeAnalysis = {
                    passed: true, // Don't fail if no size data
                    skipped: true,
                    reason: 'File size data not available',
                    originalSize: originalSize,
                    newSize: newSize
                };
            } else {
                logger.extended(`Original file size: ${formatSize(originalSize)} (${originalSize.toLocaleString()} bytes)`);
                logger.extended(`New file size: ${formatSize(newSize)} (${newSize.toLocaleString()} bytes)`);
                
                const sizeRatio = (newSize / originalSize) * 100;
                const sizeDifference = newSize - originalSize;
                const sizeChangePercent = (sizeDifference / originalSize) * 100;
                
                const lowerBound = (sizeGreaterThan / 100) * originalSize;
                const upperBound = (sizeLessThan / 100) * originalSize;
                
                logger.extended(`Size ratio: ${safeToFixed(sizeRatio, 3)}%`);
                logger.extended(`Size change: ${sizeChangePercent > 0 ? '+' : ''}${safeToFixed(sizeChangePercent, 2)}%`);
                logger.extended(`Acceptable range: ${formatSize(lowerBound)} - ${formatSize(upperBound)}`);
                
                const sizeWithinBounds = newSize >= lowerBound && newSize <= upperBound;
                
                sizeAnalysis = {
                    passed: sizeWithinBounds,
                    originalSize,
                    newSize,
                    originalFormatted: formatSize(originalSize),
                    newFormatted: formatSize(newSize),
                    ratio: sizeRatio,
                    difference: sizeDifference,
                    changePercent: sizeChangePercent,
                    lowerBound,
                    upperBound,
                    withinBounds: sizeWithinBounds
                };
                
                if (sizeWithinBounds) {
                    logger.success(`✅ Size validation PASSED: ${safeToFixed(sizeRatio, 3)}% within acceptable range`);
                    if (sizeChangePercent < 0) {
                        logger.success(`🎯 Achieved ${safeToFixed(Math.abs(sizeChangePercent), 2)}% size reduction`);
                    } else {
                        logger.info(`📈 File size increased by ${safeToFixed(sizeChangePercent, 2)}%`);
                    }
                } else {
                    if (newSize > upperBound) {
                        const exceededBy = formatSize(newSize - upperBound);
                        logger.error(`❌ Size validation FAILED: File too large by ${exceededBy}`);
                        logger.warn('Compression may have failed or settings too aggressive');
                    } else {
                        const belowBy = formatSize(lowerBound - newSize);
                        logger.error(`❌ Size validation FAILED: File too small by ${belowBy}`);
                        logger.warn('File may be over-compressed or corrupted');
                    }
                }
            }
            
            processingMetrics.sizeAnalysisTime = Date.now() - sizeStartTime;
        } else {
            logger.info('⏭️ Step 3: Size validation disabled');
            processingMetrics.sizeAnalysisTime = 0;
        }

        // ===============================================
        // STEP 4: DURATION ANALYSIS
        // ===============================================
        
        let durationAnalysis = null;
        
        if (enableDurationCheck) {
            logger.subsection('Step 4: Duration analysis and validation');
            const durationStartTime = Date.now();
            
            const originalDuration = getDuration(args.originalLibraryFile, logger);
            const newDuration = getDuration(args.inputFileObj, logger);
            
            if (originalDuration > 0) {
                logger.extended(`Original duration: ${formatDuration(originalDuration, true)} (${safeToFixed(originalDuration, 3)}s)`);
                logger.extended(`New duration: ${formatDuration(newDuration, true)} (${safeToFixed(newDuration, 3)}s)`);
                
                const durationRatio = (newDuration / originalDuration) * 100;
                const durationDifference = newDuration - originalDuration;
                const durationChangePercent = (durationDifference / originalDuration) * 100;
                
                const lowerBound = (durationGreaterThan / 100) * originalDuration;
                const upperBound = (durationLessThan / 100) * originalDuration;
                
                logger.extended(`Duration ratio: ${safeToFixed(durationRatio, 4)}%`);
                logger.extended(`Duration change: ${durationChangePercent > 0 ? '+' : ''}${safeToFixed(durationChangePercent, 4)}%`);
                logger.extended(`Acceptable range: ${formatDuration(lowerBound, true)} - ${formatDuration(upperBound, true)}`);
                
                const durationWithinBounds = newDuration >= lowerBound && newDuration <= upperBound;
                
                durationAnalysis = {
                    passed: durationWithinBounds,
                    originalDuration,
                    newDuration,
                    originalFormatted: formatDuration(originalDuration, true),
                    newFormatted: formatDuration(newDuration, true),
                    ratio: durationRatio,
                    difference: durationDifference,
                    changePercent: durationChangePercent,
                    lowerBound,
                    upperBound,
                    withinBounds: durationWithinBounds
                };
                
                if (durationWithinBounds) {
                    logger.success(`✅ Duration validation PASSED: ${safeToFixed(durationRatio, 4)}% within acceptable range`);
                    logger.success(`🎯 Duration difference: ${durationChangePercent > 0 ? '+' : ''}${safeToFixed(durationChangePercent, 4)}%`);
                } else {
                    if (newDuration > upperBound) {
                        const exceededBy = newDuration - upperBound;
                        logger.error(`❌ Duration validation FAILED: Too long by ${safeToFixed(exceededBy, 3)}s`);
                        logger.warn('File may have additional content or processing issues');
                    } else {
                        const belowBy = lowerBound - newDuration;
                        logger.error(`❌ Duration validation FAILED: Too short by ${safeToFixed(belowBy, 3)}s`);
                        logger.warn('File may be truncated or corrupted');
                    }
                }
            } else {
                logger.warn('⚠️ Duration validation skipped - no duration data available');
                logger.debug('This may be normal for image files or files without duration metadata');
                
                durationAnalysis = {
                    passed: true, // Don't fail if no duration data
                    skipped: true,
                    reason: 'No duration data available'
                };
            }
            
            processingMetrics.durationAnalysisTime = Date.now() - durationStartTime;
        } else {
            logger.info('⏭️ Step 4: Duration validation disabled');
            processingMetrics.durationAnalysisTime = 0;
        }

        // ===============================================
        // STEP 5: RESULTS ANALYSIS
        // ===============================================
        
        logger.subsection('Step 5: Results analysis and comprehensive reporting');
        
        // Determine overall result
        const issues = [];
        let overallResult = true;
        
        if (sizeAnalysis && !sizeAnalysis.passed && !sizeAnalysis.skipped) {
            overallResult = false;
            if (sizeAnalysis.newSize > sizeAnalysis.upperBound) {
                issues.push(`File size too large: ${safeToFixed(sizeAnalysis.ratio, 2)}% (limit: ${sizeLessThan}%)`);
            } else {
                issues.push(`File size too small: ${safeToFixed(sizeAnalysis.ratio, 2)}% (minimum: ${sizeGreaterThan}%)`);
            }
        }
        
        if (durationAnalysis && !durationAnalysis.passed && !durationAnalysis.skipped) {
            overallResult = false;
            if (durationAnalysis.newDuration > durationAnalysis.upperBound) {
                issues.push(`Duration too long: ${safeToFixed(durationAnalysis.ratio, 4)}% (limit: ${durationLessThan}%)`);
            } else {
                issues.push(`Duration too short: ${safeToFixed(durationAnalysis.ratio, 4)}% (minimum: ${durationGreaterThan}%)`);
            }
        }

        processingMetrics.totalTime = Date.now() - startTime;

        // ===============================================
        // STEP 6: FINAL SUMMARY AND ROUTING
        // ===============================================
        
        logger.banner('🎯 FINAL VALIDATION RESULTS');
        
        if (overallResult) {
            logger.success('🎉 ALL VALIDATIONS PASSED! File meets quality standards');
            logger.success('✅ File is ready for production use');
            logger.success('🌟 No quality issues detected');
        } else {
            logger.error(`❌ VALIDATION FAILED with ${issues.length} issue(s)`);
            issues.forEach((issue, index) => {
                logger.error(`${index + 1}. ${issue}`);
            });
        }
        
        const outputNumber = overallResult ? 1 : 2;
        logger.success(`🎯 Routing to Output ${outputNumber}`);

        // Performance metrics
        if (showPerformanceMetrics) {
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Initialization: ${processingMetrics.initializationTime}ms`);
            logger.extended(`⏱️ Quality assurance: ${processingMetrics.qaTime}ms`);
            logger.extended(`⏱️ Size analysis: ${processingMetrics.sizeAnalysisTime}ms`);
            logger.extended(`⏱️ Duration analysis: ${processingMetrics.durationAnalysisTime}ms`);
            logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
            
            const efficiency = processingMetrics.totalTime > 0 ? Math.round((2 / processingMetrics.totalTime) * 1000) : 0;
            logger.extended(`📈 Processing efficiency: ${efficiency} files/second`);
        }

        // Statistical analysis for extended logging
        if (loggingLevel === 'extended' || loggingLevel === 'debug') {
            logger.subsection('Statistical Analysis');
            
            if (sizeAnalysis && !sizeAnalysis.skipped) {
                if (typeof sizeAnalysis.changePercent === 'number' && !isNaN(sizeAnalysis.changePercent)) {
                    const sizeEfficiency = sizeAnalysis.changePercent < 0 ? 
                        `${safeToFixed(Math.abs(sizeAnalysis.changePercent), 2)}% size reduction achieved` : 
                        `${safeToFixed(sizeAnalysis.changePercent, 2)}% size increase`;
                    logger.extended(`📊 Size efficiency: ${sizeEfficiency}`);
                    
                    if (sizeAnalysis.originalSize > 0 && sizeAnalysis.newSize > 0) {
                        const compressionRatio = sizeAnalysis.originalSize / sizeAnalysis.newSize;
                        logger.extended(`📊 Compression ratio: ${safeToFixed(compressionRatio, 3)}:1`);
                    }
                } else {
                    logger.extended(`📊 Size efficiency: N/A (no size data)`);
                }
            }
            
            if (durationAnalysis && !durationAnalysis.skipped) {
                if (typeof durationAnalysis.changePercent === 'number' && !isNaN(durationAnalysis.changePercent)) {
                    const durationAccuracy = 100 - Math.abs(durationAnalysis.changePercent);
                    logger.extended(`📊 Duration accuracy: ${safeToFixed(durationAccuracy, 4)}%`);
                    
                    if (typeof durationAnalysis.difference === 'number' && !isNaN(durationAnalysis.difference)) {
                        const timingPrecision = Math.abs(durationAnalysis.difference);
                        logger.extended(`📊 Timing precision: ±${safeToFixed(timingPrecision, 3)}s`);
                    }
                } else {
                    logger.extended(`📊 Duration accuracy: N/A (no duration data)`);
                }
            }
            
            // Quality score calculation
            let qualityScore = 100;
            if (sizeAnalysis && !sizeAnalysis.passed && !sizeAnalysis.skipped) qualityScore -= 50;
            if (durationAnalysis && !durationAnalysis.passed && !durationAnalysis.skipped) qualityScore -= 50;
            qualityScore -= validationResult.warnings.length * 5;
            qualityScore = Math.max(0, qualityScore);
            
            logger.extended(`📊 Overall quality score: ${qualityScore}/100`);
        }

        // Feature utilization summary
        if (loggingLevel === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Size validation', enabled: enableSizeCheck },
                { name: 'Duration validation', enabled: enableDurationCheck },
                { name: 'Quality assurance', enabled: enableQA },
                { name: 'Performance metrics', enabled: showPerformanceMetrics },
                { name: 'Report generation', enabled: generateReport }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`📊 Validation checks performed: ${(enableSizeCheck ? 1 : 0) + (enableDurationCheck ? 1 : 0)}`);
            logger.debug(`⚠️ Issues detected: ${issues.length}`);
            logger.debug(`📋 QA warnings: ${validationResult.warnings.length}`);
        }

        // Enhanced variables with comprehensive information
        const updatedVariables = {
            ...args.variables,
            
            // Comparison results
            comparisonResult: overallResult ? 'passed' : 'failed',
            comparisonIssueCount: issues.length,
            comparisonIssues: issues.join('; '),
            
            // Size analysis variables
            ...(sizeAnalysis && !sizeAnalysis.skipped && {
                sizeValidationEnabled: true,
                sizeValidationPassed: sizeAnalysis.passed,
                originalFileSize: sizeAnalysis.originalSize,
                newFileSize: sizeAnalysis.newSize,
                fileSizeRatio: sizeAnalysis.ratio,
                fileSizeChangePercent: sizeAnalysis.changePercent,
                fileSizeDifference: sizeAnalysis.difference
            }),
            
            // Duration analysis variables
            ...(durationAnalysis && !durationAnalysis.skipped && {
                durationValidationEnabled: true,
                durationValidationPassed: durationAnalysis.passed,
                originalDuration: durationAnalysis.originalDuration,
                newDuration: durationAnalysis.newDuration,
                durationRatio: durationAnalysis.ratio,
                durationChangePercent: durationAnalysis.changePercent,
                durationDifference: durationAnalysis.difference
            }),
            
            // Processing metadata
            comparisonProcessingTime: processingMetrics.totalTime,
            comparisonTimestamp: new Date().toISOString(),
            comparisonPluginVersion: '3.0'
        };

        // Recommendations and insights
        logger.subsection('Recommendations and Insights');
        
        if (overallResult) {
            logger.success('🎯 File validation successful - no action required');
            
            if (sizeAnalysis && !sizeAnalysis.skipped) {
                if (sizeAnalysis.changePercent < -20) {
                    logger.success('🌟 Excellent compression achieved');
                } else if (sizeAnalysis.changePercent < -10) {
                    logger.success('👍 Good compression achieved');
                } else if (sizeAnalysis.changePercent > 10) {
                    logger.info('💡 Consider reviewing compression settings for better efficiency');
                }
            }
            
            if (durationAnalysis && !durationAnalysis.skipped) {
                if (Math.abs(durationAnalysis.changePercent) < 0.1) {
                    logger.success('🎯 Perfect timing preservation');
                } else if (Math.abs(durationAnalysis.changePercent) < 0.5) {
                    logger.success('✅ Excellent timing accuracy');
                }
            }
        } else {
            logger.warn('📋 Action required to resolve validation failures:');
            
            if (sizeAnalysis && !sizeAnalysis.passed && !sizeAnalysis.skipped) {
                if (sizeAnalysis.newSize > sizeAnalysis.upperBound) {
                    logger.warn('• Increase compression settings or reduce quality');
                    logger.warn('• Check for encoding inefficiencies');
                    logger.warn('• Verify input file is not corrupted');
                } else {
                    logger.warn('• Reduce compression or increase quality settings');
                    logger.warn('• Check for over-aggressive compression');
                    logger.warn('• Verify output file integrity');
                }
            }
            
            if (durationAnalysis && !durationAnalysis.passed && !durationAnalysis.skipped) {
                if (durationAnalysis.newDuration > durationAnalysis.upperBound) {
                    logger.warn('• Check for duplicate frames or processing artifacts');
                    logger.warn('• Verify frame rate settings');
                    logger.warn('• Review encoding parameters');
                } else {
                    logger.warn('• Check for frame drops or truncation');
                    logger.warn('• Verify input file completeness');
                    logger.warn('• Review processing pipeline');
                }
            }
        }

        logger.success('✅ Enhanced File Comparison complete!');
        logger.info(`🎯 Final result: ${overallResult ? 'VALIDATION PASSED' : 'VALIDATION FAILED'} → Output ${outputNumber}`);
        logger.banner('🚀 COMPARISON ANALYSIS COMPLETED SUCCESSFULLY');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
            outputNumber: outputNumber,
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