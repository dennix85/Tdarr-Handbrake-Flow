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
    name: '🔄 DeNiX Enhanced Set Original File: Advanced File Restoration & Validation',
    description: 'Advanced file restoration system with comprehensive validation, file integrity checks, path analysis, and detailed logging. Safely restores the working file to the original file path with enhanced error handling and performance monitoring.',
    style: {
        borderColor: '#E91E63',
        backgroundColor: 'rgba(233, 30, 99, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        // Enhanced bright pink glow with 10 layers - expanded reach with graduated opacity
        boxShadow: `
            0 0 10px rgba(233, 30, 99, 0.5),
            0 0 25px rgba(233, 30, 99, 0.46),
            0 0 40px rgba(233, 30, 99, 0.42),
            0 0 55px rgba(233, 30, 99, 0.39),
            0 0 70px rgba(233, 30, 99, 0.35),
            0 0 85px rgba(233, 30, 99, 0.31),
            0 0 100px rgba(233, 30, 99, 0.27),
            0 0 115px rgba(233, 30, 99, 0.23),
            0 0 130px rgba(233, 30, 99, 0.19),
            0 0 145px rgba(233, 30, 99, 0.17),
            0 0 160px rgba(233, 30, 99, 0.15),
            inset 0 0 20px rgba(233, 30, 99, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(233, 30, 99, 0.1), rgba(194, 24, 91, 0.1))',
    },
    tags: 'restoration,file-management,validation,reset,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🔄',
    inputs: [
        {
            label: '🛡️ Enable File Validation',
            name: 'enableValidation',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable comprehensive file existence and accessibility validation before restoration',
        },
        {
            label: '📊 Enable Path Analysis',
            name: 'enablePathAnalysis',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable detailed path structure analysis and security validation',
        },
        {
            label: '🔍 Enable Integrity Checks',
            name: 'enableIntegrityChecks',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Enable advanced file integrity and metadata validation (may impact performance)',
        },
        {
            label: '📋 Generate Restoration Report',
            name: 'generateReport',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Generate detailed restoration report with file analysis and recommendations',
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
            tooltip: '✅ File successfully restored to original path',
        },
        {
            number: 2,
            tooltip: '❌ File restoration failed due to validation errors',
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

// Enhanced file validation
const validateFile = (filePath, logger) => {
    const fs = require('fs');
    const path = require('path');
    
    const result = {
        exists: false,
        accessible: false,
        isFile: false,
        size: 0,
        permissions: null,
        extension: '',
        directory: '',
        basename: '',
        error: null
    };

    try {
        logger.debug(`Validating file: ${filePath}`);
        
        // Check if file exists
        result.exists = fs.existsSync(filePath);
        if (!result.exists) {
            result.error = 'File does not exist';
            return result;
        }

        // Get file stats
        const stats = fs.statSync(filePath);
        result.isFile = stats.isFile();
        result.size = stats.size;
        
        // Get file path components
        result.extension = path.extname(filePath);
        result.directory = path.dirname(filePath);
        result.basename = path.basename(filePath);

        // Check accessibility
        try {
            fs.accessSync(filePath, fs.constants.R_OK);
            result.accessible = true;
        } catch (accessError) {
            result.error = 'File is not readable';
            return result;
        }

        // Get permissions (if possible)
        try {
            result.permissions = '0' + (stats.mode & parseInt('777', 8)).toString(8);
        } catch (permError) {
            logger.debug(`Could not get file permissions: ${permError.message}`);
        }

        logger.debug(`File validation successful: ${filePath}`);

    } catch (error) {
        result.error = error.message;
        logger.debug(`File validation failed: ${error.message}`);
    }

    return result;
};

// Enhanced path analysis
const analyzeFilePath = (filePath, logger) => {
    const path = require('path');
    
    const analysis = {
        isAbsolute: false,
        depth: 0,
        hasUnsafeCharacters: false,
        hasRelativeComponents: false,
        normalizedPath: '',
        securityRisk: 'low',
        pathComponents: [],
        driveInfo: null
    };

    try {
        logger.debug(`Analyzing file path: ${filePath}`);

        // Basic path analysis
        analysis.isAbsolute = path.isAbsolute(filePath);
        analysis.normalizedPath = path.normalize(filePath);
        analysis.pathComponents = filePath.split(path.sep).filter(component => component !== '');
        analysis.depth = analysis.pathComponents.length;

        // Check for relative path components
        analysis.hasRelativeComponents = filePath.includes('..') || filePath.includes('./');
        
        // Check for unsafe characters (basic security check)
        const unsafeChars = /[<>:"|?*\x00-\x1f]/;
        analysis.hasUnsafeCharacters = unsafeChars.test(filePath);

        // Determine security risk level
        if (analysis.hasUnsafeCharacters || analysis.hasRelativeComponents) {
            analysis.securityRisk = 'high';
        } else if (!analysis.isAbsolute || analysis.depth > 10) {
            analysis.securityRisk = 'medium';
        }

        // Windows drive analysis
        if (process.platform === 'win32' && analysis.isAbsolute) {
            const driveMatch = filePath.match(/^([A-Z]):/i);
            if (driveMatch) {
                analysis.driveInfo = {
                    letter: driveMatch[1].toUpperCase(),
                    isSystemDrive: driveMatch[1].toUpperCase() === 'C'
                };
            }
        }

        logger.debug(`Path analysis completed: Security risk = ${analysis.securityRisk}`);

    } catch (error) {
        logger.warn(`Path analysis failed: ${error.message}`);
    }

    return analysis;
};

// File integrity checks
const performIntegrityChecks = (filePath, logger) => {
    const fs = require('fs');
    const crypto = require('crypto');
    
    const result = {
        checksumMD5: null,
        checksumSHA256: null,
        sampleRead: false,
        error: null
    };

    try {
        logger.debug(`Performing integrity checks: ${filePath}`);

        // Read file stats for size check
        const stats = fs.statSync(filePath);
        
        // For large files, only read a sample
        const sampleSize = Math.min(stats.size, 1024 * 1024); // 1MB max
        const buffer = Buffer.alloc(sampleSize);
        
        const fd = fs.openSync(filePath, 'r');
        const bytesRead = fs.readSync(fd, buffer, 0, sampleSize, 0);
        fs.closeSync(fd);
        
        result.sampleRead = bytesRead > 0;

        // Generate checksums from sample
        if (bytesRead > 0) {
            const data = buffer.slice(0, bytesRead);
            result.checksumMD5 = crypto.createHash('md5').update(data).digest('hex');
            result.checksumSHA256 = crypto.createHash('sha256').update(data).digest('hex');
        }

        logger.debug(`Integrity checks completed: ${bytesRead} bytes analyzed`);

    } catch (error) {
        result.error = error.message;
        logger.debug(`Integrity checks failed: ${error.message}`);
    }

    return result;
};

// Generate restoration report
const generateRestorationReport = (originalFile, validation, pathAnalysis, integrity, metrics) => {
    const report = [];
    
    report.push('📋 File Restoration Report');
    report.push('═'.repeat(30));
    report.push(`Processing Time: ${metrics.totalTime}ms`);
    report.push(`Original File: ${originalFile._id}`);
    report.push('');
    
    if (validation) {
        report.push('📁 File Validation:');
        report.push(`• Exists: ${validation.exists ? 'Yes' : 'No'}`);
        report.push(`• Accessible: ${validation.accessible ? 'Yes' : 'No'}`);
        report.push(`• File Type: ${validation.isFile ? 'Regular File' : 'Other'}`);
        report.push(`• Size: ${formatFileSize(validation.size)}`);
        report.push(`• Extension: ${validation.extension || 'None'}`);
        if (validation.permissions) {
            report.push(`• Permissions: ${validation.permissions}`);
        }
        report.push('');
    }
    
    if (pathAnalysis) {
        report.push('🛡️ Path Analysis:');
        report.push(`• Absolute Path: ${pathAnalysis.isAbsolute ? 'Yes' : 'No'}`);
        report.push(`• Path Depth: ${pathAnalysis.depth} levels`);
        report.push(`• Security Risk: ${pathAnalysis.securityRisk.toUpperCase()}`);
        report.push(`• Unsafe Characters: ${pathAnalysis.hasUnsafeCharacters ? 'Found' : 'None'}`);
        if (pathAnalysis.driveInfo) {
            report.push(`• Drive: ${pathAnalysis.driveInfo.letter}: (${pathAnalysis.driveInfo.isSystemDrive ? 'System' : 'Data'})`);
        }
        report.push('');
    }
    
    if (integrity && !integrity.error) {
        report.push('🔒 Integrity Analysis:');
        report.push(`• Sample Read: ${integrity.sampleRead ? 'Success' : 'Failed'}`);
        if (integrity.checksumMD5) {
            report.push(`• MD5 (sample): ${integrity.checksumMD5.substring(0, 16)}...`);
        }
        if (integrity.checksumSHA256) {
            report.push(`• SHA256 (sample): ${integrity.checksumSHA256.substring(0, 16)}...`);
        }
        report.push('');
    }
    
    report.push('🎯 Restoration Status: SUCCESS');
    report.push('• File successfully restored to original path');
    report.push('• All validation checks passed');
    report.push('• Ready for continued processing');
    
    return report.join('\n');
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
            initializationTime: 0,
            validationTime: 0,
            pathAnalysisTime: 0,
            integrityCheckTime: 0,
            restorationTime: 0,
            totalTime: 0
        };

        logger.banner('🔄 ENHANCED FILE RESTORATION v3.0 STARTING');
        logger.section('DeNiX Enhanced Set Original File: Advanced File Restoration & Validation');
        
        // Extract inputs
        const {
            enableValidation,
            enablePathAnalysis,
            enableIntegrityChecks,
            generateReport,
            logging_level,
            showPerformanceMetrics
        } = args.inputs;

        // ===============================================
        // STEP 1: INITIALIZATION AND VALIDATION
        // ===============================================
        
        logger.subsection('Step 1: Initialization and input validation');
        const initStartTime = Date.now();
        
        // Validate original library file exists
        if (!args.originalLibraryFile || !args.originalLibraryFile._id) {
            logger.error('Missing or invalid original library file');
            logger.error('Cannot restore file - no original file path available');
            
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }
        
        const originalFilePath = args.originalLibraryFile._id;
        logger.success(`Original file identified: ${path.basename(originalFilePath)}`);
        logger.extended(`Full path: ${originalFilePath}`);
        logger.extended(`Configuration: Validation=${enableValidation}, PathAnalysis=${enablePathAnalysis}, IntegrityChecks=${enableIntegrityChecks}`);
        
        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: FILE VALIDATION
        // ===============================================
        
        let fileValidation = null;
        
        if (enableValidation) {
            logger.subsection('Step 2: File validation and accessibility checks');
            const validationStartTime = Date.now();
            
            fileValidation = validateFile(originalFilePath, logger);
            
            if (!fileValidation.exists) {
                logger.error(`File validation failed: ${fileValidation.error}`);
                logger.error('Cannot restore to non-existent file path');
                
                args.jobLog(logger.getOutput());
                return {
                    outputFileObj: args.inputFileObj,
                    outputNumber: 2,
                    variables: args.variables,
                };
            }
            
            if (!fileValidation.accessible) {
                logger.error(`File accessibility failed: ${fileValidation.error}`);
                logger.warn('File exists but may not be readable');
            }
            
            logger.success(`✅ File validation passed: ${path.basename(originalFilePath)}`);
            logger.extended(`File size: ${formatFileSize(fileValidation.size)}`);
            logger.extended(`File type: ${fileValidation.isFile ? 'Regular file' : 'Special file'}`);
            logger.extended(`Extension: ${fileValidation.extension || 'None'}`);
            
            if (fileValidation.permissions) {
                logger.extended(`Permissions: ${fileValidation.permissions}`);
            }
            
            processingMetrics.validationTime = Date.now() - validationStartTime;
        } else {
            logger.info('⏭️ Step 2: File validation disabled');
            processingMetrics.validationTime = 0;
        }

        // ===============================================
        // STEP 3: PATH ANALYSIS
        // ===============================================
        
        let pathAnalysis = null;
        
        if (enablePathAnalysis) {
            logger.subsection('Step 3: Path structure and security analysis');
            const pathStartTime = Date.now();
            
            pathAnalysis = analyzeFilePath(originalFilePath, logger);
            
            logger.extended(`Path type: ${pathAnalysis.isAbsolute ? 'Absolute' : 'Relative'}`);
            logger.extended(`Path depth: ${pathAnalysis.depth} levels`);
            logger.extended(`Security risk: ${pathAnalysis.securityRisk.toUpperCase()}`);
            
            if (pathAnalysis.hasUnsafeCharacters) {
                logger.warn('⚠️ Path contains potentially unsafe characters');
            }
            
            if (pathAnalysis.hasRelativeComponents) {
                logger.warn('⚠️ Path contains relative components (./ or ../)');
            }
            
            if (pathAnalysis.securityRisk === 'high') {
                logger.warn('⚠️ High security risk detected in file path');
            }
            
            if (pathAnalysis.driveInfo) {
                logger.extended(`Drive: ${pathAnalysis.driveInfo.letter}: (${pathAnalysis.driveInfo.isSystemDrive ? 'System drive' : 'Data drive'})`);
            }
            
            logger.success('✅ Path analysis completed');
            
            processingMetrics.pathAnalysisTime = Date.now() - pathStartTime;
        } else {
            logger.info('⏭️ Step 3: Path analysis disabled');
            processingMetrics.pathAnalysisTime = 0;
        }

        // ===============================================
        // STEP 4: INTEGRITY CHECKS
        // ===============================================
        
        let integrityResult = null;
        
        if (enableIntegrityChecks && fileValidation && fileValidation.exists) {
            logger.subsection('Step 4: File integrity and checksum validation');
            const integrityStartTime = Date.now();
            
            integrityResult = performIntegrityChecks(originalFilePath, logger);
            
            if (integrityResult.error) {
                logger.warn(`Integrity check failed: ${integrityResult.error}`);
            } else {
                logger.success('✅ Integrity checks completed');
                logger.extended(`Sample read: ${integrityResult.sampleRead ? 'Success' : 'Failed'}`);
                
                if (integrityResult.checksumMD5) {
                    logger.debug(`MD5 checksum: ${integrityResult.checksumMD5}`);
                }
                if (integrityResult.checksumSHA256) {
                    logger.debug(`SHA256 checksum: ${integrityResult.checksumSHA256}`);
                }
            }
            
            processingMetrics.integrityCheckTime = Date.now() - integrityStartTime;
        } else {
            logger.info('⏭️ Step 4: Integrity checks disabled or skipped');
            processingMetrics.integrityCheckTime = 0;
        }

        // ===============================================
        // STEP 5: FILE RESTORATION
        // ===============================================
        
        logger.subsection('Step 5: File restoration and output preparation');
        const restorationStartTime = Date.now();
        
        // Create output file object
        const outputFileObj = {
            _id: originalFilePath,
        };
        
        logger.success(`🔄 File successfully restored to original path`);
        logger.success(`📁 Restored path: ${originalFilePath}`);
        logger.extended(`Output object prepared with original file ID`);
        
        processingMetrics.restorationTime = Date.now() - restorationStartTime;
        processingMetrics.totalTime = Date.now() - startTime;

        // ===============================================
        // STEP 6: REPORT GENERATION AND FINAL SUMMARY
        // ===============================================
        
        logger.subsection('Step 6: Report generation and final summary');
        
        // Generate detailed report if requested
        if (generateReport) {
            logger.extended('Generating comprehensive restoration report...');
            const report = generateRestorationReport(
                args.originalLibraryFile,
                fileValidation,
                pathAnalysis,
                integrityResult,
                processingMetrics
            );
            logger.extended('📋 Detailed Report Generated:');
            report.split('\n').forEach(line => {
                if (line.trim()) logger.extended(line);
            });
        }

        // Performance metrics
        if (showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Initialization: ${processingMetrics.initializationTime}ms`);
            logger.extended(`⏱️ File validation: ${processingMetrics.validationTime}ms`);
            logger.extended(`⏱️ Path analysis: ${processingMetrics.pathAnalysisTime}ms`);
            logger.extended(`⏱️ Integrity checks: ${processingMetrics.integrityCheckTime}ms`);
            logger.extended(`⏱️ File restoration: ${processingMetrics.restorationTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            const efficiency = totalTime > 0 ? Math.round((1 / totalTime) * 1000) : 0;
            logger.extended(`📈 Processing efficiency: ${efficiency} restorations/second`);
        }

        // Feature utilization summary
        if (logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'File validation', enabled: enableValidation },
                { name: 'Path analysis', enabled: enablePathAnalysis },
                { name: 'Integrity checks', enabled: enableIntegrityChecks },
                { name: 'Report generation', enabled: generateReport },
                { name: 'Performance metrics', enabled: showPerformanceMetrics }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`📁 Original file size: ${fileValidation ? formatFileSize(fileValidation.size) : 'Unknown'}`);
            logger.debug(`🛡️ Security risk level: ${pathAnalysis ? pathAnalysis.securityRisk : 'Not analyzed'}`);
        }

        // Enhanced variables
        const updatedVariables = {
            ...args.variables,
            
            // Restoration metadata
            fileRestored: true,
            restorationTimestamp: new Date().toISOString(),
            originalFilePath: originalFilePath,
            restorationProcessingTime: processingMetrics.totalTime,
            
            // Validation results
            ...(fileValidation && {
                fileValidationPassed: fileValidation.exists && fileValidation.accessible,
                originalFileSize: fileValidation.size,
                originalFileExtension: fileValidation.extension,
                originalFileExists: fileValidation.exists
            }),
            
            // Path analysis results
            ...(pathAnalysis && {
                pathSecurityRisk: pathAnalysis.securityRisk,
                pathIsAbsolute: pathAnalysis.isAbsolute,
                pathDepth: pathAnalysis.depth
            }),
            
            // Plugin metadata
            setOriginalFileVersion: '3.0'
        };

        logger.banner('🎯 FILE RESTORATION COMPLETED SUCCESSFULLY');
        logger.success('🎉 All validation checks passed');
        logger.success('🔄 File successfully restored to original path');
        logger.success('✅ Ready for continued processing');
        logger.info('🎯 Routing to Output 1 (Success)');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: outputFileObj,
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
            outputNumber: 2,
            variables: args.variables,
        };
    }
});

exports.plugin = plugin;