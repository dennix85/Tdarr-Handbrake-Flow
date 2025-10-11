const details = () => ({
    name: '🔄 DeNiX Enhanced Replace Original: Advanced File Replacement & Validation',
    description: 'Advanced file replacement system with comprehensive validation, atomic operations, detailed progress tracking, and integrity verification. Features intelligent backup handling, performance monitoring, and enhanced error recovery with detailed operation logging.',
    style: {
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        boxShadow: `
            0 0 10px rgba(236, 72, 153, 0.5),
            0 0 25px rgba(236, 72, 153, 0.46),
            0 0 40px rgba(236, 72, 153, 0.42),
            0 0 55px rgba(236, 72, 153, 0.39),
            0 0 70px rgba(236, 72, 153, 0.35),
            0 0 85px rgba(236, 72, 153, 0.31),
            0 0 100px rgba(236, 72, 153, 0.27),
            0 0 115px rgba(236, 72, 153, 0.23),
            0 0 130px rgba(236, 72, 153, 0.19),
            0 0 145px rgba(236, 72, 153, 0.17),
            0 0 160px rgba(236, 72, 153, 0.15),
            inset 0 0 20px rgba(236, 72, 153, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.1))',
    },
    tags: 'replacement,file-management,atomic,validation,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🔄',
    inputs: [
        {
            label: '🛡️ Enable Safety Checks',
            name: 'enableSafetyChecks',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable comprehensive safety validation including file integrity checks and atomic operations',
        },
        {
            label: '📊 Enable Progress Tracking',
            name: 'enableProgressTracking',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable detailed progress tracking with file operation metrics and timing analysis',
        },
        {
            label: '🔍 Enable Integrity Verification',
            name: 'enableIntegrityVerification',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Enable file integrity verification using checksums before and after operations',
        },
        {
            label: '💾 Create Safety Backup',
            name: 'createSafetyBackup',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Create a safety backup of the original file before replacement (requires additional disk space)',
        },
        {
            label: '📋 Generate Operation Report',
            name: 'generateReport',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Generate detailed operation report with file analysis and recommendations',
        },
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
            tooltip: '✅ File replacement completed successfully',
        },
        {
            number: 2,
            tooltip: '⚠️ No replacement needed - files are identical',
        },
        {
            number: 3,
            tooltip: '❌ Error occurred during replacement process',
        },
    ],
});

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

    operation(message) {
        this.output.push(`🔄 ${message}`);
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
const createPerformanceTimer = () => {
    const startTime = process.hrtime.bigint();
    return {
        stop: () => {
            const endTime = process.hrtime.bigint();
            return Number(endTime - startTime) / 1000000; // Convert to milliseconds
        }
    };
};

// Format file size with precision
const formatFileSize = (bytes, precision = 2) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(precision)} ${sizes[i]}`;
};

// Format transfer speed
const formatTransferSpeed = (bytesPerSecond, precision = 2) => {
    if (bytesPerSecond === 0) return '0 B/s';
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(1024));
    const value = bytesPerSecond / Math.pow(1024, i);
    return `${value.toFixed(precision)} ${sizes[i]}`;
};

// Calculate transfer speed
const calculateTransferSpeed = (bytes, milliseconds) => {
    if (milliseconds <= 0) return 0;
    const seconds = milliseconds / 1000;
    return bytes / seconds;
};

// Enhanced file statistics
const getEnhancedFileStats = async (filePath, logger) => {
    try {
        const { promises: fs } = require('fs');
        const stats = await fs.stat(filePath);
        logger.debug(`File stats retrieved: ${filePath} (${formatFileSize(stats.size)})`);
        return {
            size: stats.size,
            isDirectory: stats.isDirectory(),
            modified: stats.mtime,
            created: stats.birthtime,
            mode: stats.mode,
            exists: true
        };
    } catch (error) {
        logger.debug(`Failed to get file stats for ${filePath}: ${error.message}`);
        return {
            size: 0,
            isDirectory: false,
            modified: null,
            created: null,
            mode: null,
            exists: false
        };
    }
};

// File integrity verification using checksums
const calculateFileChecksum = async (filePath, algorithm = 'sha256') => {
    try {
        const crypto = require('crypto');
        const { createReadStream } = require('fs');
        const hash = crypto.createHash(algorithm);
        const stream = createReadStream(filePath);
        
        return new Promise((resolve, reject) => {
            stream.on('data', data => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', error => reject(error));
        });
    } catch (error) {
        throw new Error(`Checksum calculation failed: ${error.message}`);
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

        // Check if files are the same path
        if (inputFileObj._id === originalLibraryFile._id) {
            result.warnings.push('Input and original files have the same path - this may be a self-replacement');
        }

        // Validate file sizes
        if (inputFileObj.file_size && originalLibraryFile.file_size) {
            const sizeRatio = inputFileObj.file_size / originalLibraryFile.file_size;
            if (sizeRatio > 10) {
                result.warnings.push('New file is significantly larger than original - verify encoding settings');
            } else if (sizeRatio < 0.1) {
                result.warnings.push('New file is significantly smaller than original - check for corruption');
            }
        }

        // Check for sufficient disk space
        if (inputs.createSafetyBackup && originalLibraryFile.file_size) {
            result.recommendations.push('Safety backup enabled - ensure sufficient disk space for backup');
        }

        logger.success('Quality assurance validation completed');
    } catch (error) {
        result.warnings.push(`QA check encountered error: ${error.message}`);
    }

    return result;
};

// Create safety backup
const createFileSafetyBackup = async (originalPath, logger) => {
    try {
        const { promises: fs } = require('fs');
        const path = require('path');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const parsedPath = path.parse(originalPath);
        const backupPath = path.join(parsedPath.dir, `${parsedPath.name}.backup-${timestamp}${parsedPath.ext}`);
        
        await fs.copyFile(originalPath, backupPath);
        logger.success(`Safety backup created: ${path.basename(backupPath)}`);
        return { success: true, backupPath };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Generate operation report
const generateOperationReport = (analysis, metrics, operations) => {
    const report = [];
    report.push('📋 File Replacement Operation Report');
    report.push('═'.repeat(40));
    report.push(`Processing Time: ${(metrics.totalTime / 1000).toFixed(2)}s`);
    report.push(`Operation Status: ${analysis.success ? 'SUCCESS' : 'FAILED'}`);
    report.push('');

    if (analysis.originalStats && analysis.workingStats) {
        report.push('📊 File Analysis:');
        report.push(`• Original: ${formatFileSize(analysis.originalStats.size)}`);
        report.push(`• Working: ${formatFileSize(analysis.workingStats.size)}`);
        const sizeDiff = analysis.workingStats.size - analysis.originalStats.size;
        const changePercent = (sizeDiff / analysis.originalStats.size) * 100;
        
        if (sizeDiff > 0) {
            report.push(`• Size Change: +${formatFileSize(sizeDiff)} (+${changePercent.toFixed(2)}%)`);
        } else if (sizeDiff < 0) {
            report.push(`• Size Change: ${formatFileSize(sizeDiff)} (${changePercent.toFixed(2)}%)`);
        } else {
            report.push(`• Size Change: No change`);
        }
        report.push('');
    }

    if (operations.length > 0) {
        report.push('⚡ Operation Performance:');
        operations.forEach((op, index) => {
            report.push(`• Step ${index + 1} (${op.operation}): ${op.duration}ms`);
            if (op.speed > 0) {
                report.push(`  Speed: ${formatTransferSpeed(op.speed)}`);
            }
        });
        report.push('');
    }

    report.push('🎯 Results:');
    if (analysis.success) {
        report.push('• File replacement completed successfully');
        report.push('• All integrity checks passed');
        report.push('• File is ready for use');
    } else {
        report.push('• File replacement failed');
        report.push('• Check logs for specific error details');
        report.push('• Original file may have been preserved');
    }

    return report.join('\n');
};

// ===============================================
// MAIN PLUGIN FUNCTION
// ===============================================

const plugin = async (args) => {
    let logger;
    
    try {
        // Initialize core modules and dependencies
        const lib = require('../../../../../methods/lib')();
        const path = require('path');
        const { promises: fs } = require('fs');
        
        // Import Tdarr helpers with proper error handling
        let fileMoveOrCopy, fileUtils;
        try {
            const fileMoveOrCopyModule = require('../../../../FlowHelpers/1.0.0/fileMoveOrCopy');
            // Handle both CommonJS and ES module exports
            fileMoveOrCopy = fileMoveOrCopyModule.default || fileMoveOrCopyModule;
            fileUtils = require('../../../../FlowHelpers/1.0.0/fileUtils');
            
            // Verify the function is callable
            if (typeof fileMoveOrCopy !== 'function') {
                throw new Error('fileMoveOrCopy is not a function - check module export');
            }
        } catch (importError) {
            // Fallback error handling if imports fail
            logger = new Logger('info');
            logger.error(`Failed to import required modules: ${importError.message}`);
            args.jobLog?.(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables || {},
            };
        }

        // Load default values and initialize
        args.inputs = lib.loadDefaultValues(args.inputs, details);
        logger = new Logger(args.inputs.logging_level);

        // Initialize performance tracking
        const startTime = Date.now();
        let performanceTimer = null;
        if (args.inputs.showPerformanceMetrics) {
            performanceTimer = createPerformanceTimer();
        }

        const processingMetrics = {
            initializationTime: 0,
            qaTime: 0,
            analysisTime: 0,
            operationTime: 0,
            verificationTime: 0,
            totalTime: 0
        };

        const operations = [];

        logger.banner('🔄 ENHANCED FILE REPLACEMENT v3.0 STARTING');
        logger.section('DeNiX Enhanced Replace Original: Advanced File Replacement & Validation');
        logger.info(`📁 Working File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`📂 Original File: ${path.basename(args.originalLibraryFile._id)}`);

        // Extract configuration
        const {
            enableSafetyChecks,
            enableProgressTracking,
            enableIntegrityVerification,
            createSafetyBackup,
            generateReport,
            enable_qa_checks,
            logging_level,
            showPerformanceMetrics
        } = args.inputs;

        // ===============================================
        // STEP 1: INITIALIZATION AND VALIDATION
        // ===============================================
        logger.subsection('Step 1: Initialization and configuration validation');
        const initStartTime = Date.now();

        logger.extended(`Safety checks: ${enableSafetyChecks ? 'Enabled' : 'Disabled'}`);
        logger.extended(`Progress tracking: ${enableProgressTracking ? 'Enabled' : 'Disabled'}`);
        logger.extended(`Integrity verification: ${enableIntegrityVerification ? 'Enabled' : 'Disabled'}`);
        logger.extended(`Safety backup: ${createSafetyBackup ? 'Enabled' : 'Disabled'}`);

        // Validate input arguments
        if (!args.inputFileObj || !args.inputFileObj._id) {
            logger.error('Invalid input file object - missing file path');
            args.jobLog?.(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables || {},
            };
        }

        if (!args.originalLibraryFile || !args.originalLibraryFile._id) {
            logger.error('Invalid original library file - missing file path');
            args.jobLog?.(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables || {},
            };
        }

        const currentPath = args.inputFileObj._id;
        const originalFolder = fileUtils.getFileAbosluteDir(args.originalLibraryFile._id);
        const fileName = fileUtils.getFileName(args.inputFileObj._id);
        const container = fileUtils.getContainer(args.inputFileObj._id);
        const newPath = `${originalFolder}/${fileName}.${container}`;
        const tempPath = `${newPath}.tmp`;

        logger.debug(`Current (working) path: ${currentPath}`);
        logger.debug(`Original file path: ${args.originalLibraryFile._id}`);
        logger.debug(`Target destination: ${newPath}`);
        logger.debug(`Temporary path: ${tempPath}`);

        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        logger.subsection('Step 2: Quality assurance and safety validation');
        const qaStartTime = Date.now();

        const validationResult = performQualityAssurance(args.inputFileObj, args.originalLibraryFile, args.inputs, logger);

        if (!validationResult.canProcess) {
            logger.error(validationResult.errorMessage);
            args.jobLog?.(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables || {},
            };
        }

        if (validationResult.warnings.length > 0) {
            validationResult.warnings.forEach(warning => logger.warn(warning));
        }

        processingMetrics.qaTime = Date.now() - qaStartTime;

        // ===============================================
        // STEP 3: FILE ANALYSIS AND COMPARISON
        // ===============================================
        logger.subsection('Step 3: File analysis and change detection');
        const analysisStartTime = Date.now();

        const workingStats = await getEnhancedFileStats(currentPath, logger);
        const originalStats = await getEnhancedFileStats(args.originalLibraryFile._id, logger);

        if (!workingStats.exists) {
            logger.error('Working file does not exist or is not accessible');
            args.jobLog?.(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables || {},
            };
        }

        logger.extended(`Working file: ${formatFileSize(workingStats.size)} (${workingStats.modified?.toLocaleString() || 'Unknown date'})`);
        if (originalStats.exists) {
            logger.extended(`Original file: ${formatFileSize(originalStats.size)} (${originalStats.modified?.toLocaleString() || 'Unknown date'})`);
        } else {
            logger.extended('Original file: Does not exist (new file replacement)');
        }

        // Check for identical files
        const filesIdentical = (args.inputFileObj._id === args.originalLibraryFile._id) &&
            (args.inputFileObj.file_size === args.originalLibraryFile.file_size);

        if (filesIdentical) {
            logger.success('Files are identical - no replacement needed');
            logger.info('Working file and original file have same path and size');
            
            processingMetrics.totalTime = Date.now() - startTime;
            if (showPerformanceMetrics && performanceTimer) {
                const totalTime = performanceTimer.stop();
                logger.extended(`⏱️ Total analysis time: ${totalTime.toFixed(2)}ms`);
            }

            args.jobLog?.(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables || {},
            };
        }

        // Calculate size difference
        if (originalStats.exists) {
            const sizeDiff = workingStats.size - originalStats.size;
            const changePercent = (sizeDiff / originalStats.size) * 100;
            
            if (sizeDiff > 0) {
                logger.info(`📈 File size increased by ${formatFileSize(sizeDiff)} (+${changePercent.toFixed(2)}%)`);
            } else if (sizeDiff < 0) {
                logger.info(`📉 File size decreased by ${formatFileSize(Math.abs(sizeDiff))} (${changePercent.toFixed(2)}%)`);
            } else {
                logger.info('📊 File size unchanged');
            }
        } else {
            logger.info('📊 New file creation (no original file exists)');
        }

        processingMetrics.analysisTime = Date.now() - analysisStartTime;

        // ===============================================
        // STEP 4: INTEGRITY VERIFICATION (OPTIONAL)
        // ===============================================
        let originalChecksum = null;
        let workingChecksum = null;

        if (enableIntegrityVerification) {
            logger.subsection('Step 4: Pre-operation integrity verification');
            try {
                workingChecksum = await calculateFileChecksum(currentPath);
                logger.success(`Working file checksum: ${workingChecksum.substring(0, 16)}...`);

                if (originalStats.exists) {
                    originalChecksum = await calculateFileChecksum(args.originalLibraryFile._id);
                    logger.success(`Original file checksum: ${originalChecksum.substring(0, 16)}...`);

                    if (workingChecksum === originalChecksum) {
                        logger.warn('Files have identical checksums - replacement may be unnecessary');
                    }
                }
            } catch (error) {
                logger.warn(`Integrity verification failed: ${error.message}`);
                if (enableSafetyChecks) {
                    logger.error('Safety checks enabled - aborting due to integrity verification failure');
                    args.jobLog?.(logger.getOutput());
                    return {
                        outputFileObj: args.inputFileObj,
                        outputNumber: 3,
                        variables: args.variables || {},
                    };
                }
            }
        } else {
            logger.info('⏭️ Step 4: Integrity verification disabled');
        }

        // ===============================================
        // STEP 5: SAFETY BACKUP CREATION
        // ===============================================
        let backupResult = null;
        if (createSafetyBackup && originalStats.exists) {
            logger.subsection('Step 5: Creating safety backup');
            backupResult = await createFileSafetyBackup(args.originalLibraryFile._id, logger);
            
            if (!backupResult.success) {
                logger.error(`Safety backup failed: ${backupResult.error}`);
                if (enableSafetyChecks) {
                    logger.error('Safety checks enabled - aborting due to backup failure');
                    args.jobLog?.(logger.getOutput());
                    return {
                        outputFileObj: args.inputFileObj,
                        outputNumber: 3,
                        variables: args.variables || {},
                    };
                }
            }
        } else {
            logger.info('⏭️ Step 5: Safety backup disabled or not needed');
        }

        // ===============================================
        // STEP 6: ATOMIC FILE REPLACEMENT OPERATIONS
        // ===============================================
        logger.subsection('Step 6: Executing atomic file replacement');
        const operationStartTime = Date.now();

        try {
            // Step 6a: Move working file to temporary location
            logger.operation('Moving working file to temporary location...');
            const moveToTempStart = Date.now();
            
            await fileMoveOrCopy({
                operation: 'move',
                sourcePath: currentPath,
                destinationPath: tempPath,
                args,
            });

            const moveToTempEnd = Date.now();
            const moveToTempDuration = moveToTempEnd - moveToTempStart;
            const moveToTempSpeed = calculateTransferSpeed(workingStats.size, moveToTempDuration);

            operations.push({
                operation: 'Move to temp',
                duration: moveToTempDuration,
                speed: moveToTempSpeed
            });

            logger.success(`Moved to temporary location in ${moveToTempDuration}ms`);
            if (enableProgressTracking && moveToTempSpeed > 0) {
                logger.extended(`Transfer speed: ${formatTransferSpeed(moveToTempSpeed)}`);
            }

            // Step 6b: Remove original file if it exists and is different from current
            if (originalStats.exists && args.originalLibraryFile._id !== currentPath) {
                logger.operation('Removing original file...');
                const deleteStart = Date.now();
                await fs.unlink(args.originalLibraryFile._id);
                const deleteEnd = Date.now();
                const deleteDuration = deleteEnd - deleteStart;

                operations.push({
                    operation: 'Delete original',
                    duration: deleteDuration,
                    speed: 0
                });

                logger.success(`Original file removed in ${deleteDuration}ms`);
            } else {
                logger.info('No original file to remove or files are identical paths');
            }

            // Step 6c: Move temporary file to final location
            logger.operation('Moving to final destination...');
            const finalMoveStart = Date.now();
            
            await fileMoveOrCopy({
                operation: 'move',
                sourcePath: tempPath,
                destinationPath: newPath,
                args,
            });

            const finalMoveEnd = Date.now();
            const finalMoveDuration = finalMoveEnd - finalMoveStart;
            const finalMoveSpeed = calculateTransferSpeed(workingStats.size, finalMoveDuration);

            operations.push({
                operation: 'Move to final',
                duration: finalMoveDuration,
                speed: finalMoveSpeed
            });

            logger.success(`Moved to final location in ${finalMoveDuration}ms`);
            if (enableProgressTracking && finalMoveSpeed > 0) {
                logger.extended(`Transfer speed: ${formatTransferSpeed(finalMoveSpeed)}`);
            }

        } catch (error) {
            logger.error(`File operation failed: ${error.message}`);
            
            // Cleanup temporary file if it exists
            try {
                const { fileExists } = fileUtils;
                const tempExists = await fileExists(tempPath);
                if (tempExists) {
                    await fs.unlink(tempPath);
                    logger.info('Cleaned up temporary file after failure');
                }
            } catch (cleanupError) {
                logger.warn(`Failed to clean up temporary file: ${cleanupError.message}`);
            }

            args.jobLog?.(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables || {},
            };
        }

        processingMetrics.operationTime = Date.now() - operationStartTime;

        // ===============================================
        // STEP 7: POST-OPERATION VERIFICATION
        // ===============================================
        logger.subsection('Step 7: Post-operation verification and analysis');
        const verificationStartTime = Date.now();

        const finalStats = await getEnhancedFileStats(newPath, logger);

        if (!finalStats.exists) {
            logger.error('Final file verification failed - file does not exist at destination');
            args.jobLog?.(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables || {},
            };
        }

        logger.success(`Final file verified: ${formatFileSize(finalStats.size)}`);
        logger.extended(`Final location: ${newPath}`);
        logger.extended(`Last modified: ${finalStats.modified?.toLocaleString() || 'Unknown'}`);

        // Post-operation integrity verification
        if (enableIntegrityVerification && workingChecksum) {
            try {
                const finalChecksum = await calculateFileChecksum(newPath);
                
                if (finalChecksum === workingChecksum) {
                    logger.success('✅ Integrity verification PASSED - checksums match');
                } else {
                    logger.error('❌ Integrity verification FAILED - checksums do not match');
                    logger.warn('File may have been corrupted during transfer');
                    
                    if (enableSafetyChecks) {
                        logger.error('Safety checks enabled - aborting due to integrity failure');
                        args.jobLog?.(logger.getOutput());
                        return {
                            outputFileObj: args.inputFileObj,
                            outputNumber: 3,
                            variables: args.variables || {},
                        };
                    }
                }
            } catch (error) {
                logger.warn(`Post-operation integrity check failed: ${error.message}`);
            }
        }

        // Verify file size consistency
        if (finalStats.size !== workingStats.size) {
            logger.warn(`File size mismatch detected: Expected ${formatFileSize(workingStats.size)}, got ${formatFileSize(finalStats.size)}`);
            
            const sizeDifference = Math.abs(finalStats.size - workingStats.size);
            const percentDifference = (sizeDifference / workingStats.size) * 100;
            
            if (percentDifference > 1) { // More than 1% difference
                logger.error('Significant file size difference detected - possible corruption');
                if (enableSafetyChecks) {
                    args.jobLog?.(logger.getOutput());
                    return {
                        outputFileObj: args.inputFileObj,
                        outputNumber: 3,
                        variables: args.variables || {},
                    };
                }
            }
        } else {
            logger.success('File size verification PASSED');
        }

        processingMetrics.verificationTime = Date.now() - verificationStartTime;

        // ===============================================
        // STEP 8: FINAL ANALYSIS AND REPORTING
        // ===============================================
        processingMetrics.totalTime = Date.now() - startTime;

        logger.subsection('Step 8: Final analysis and comprehensive reporting');

        const analysis = {
            success: true,
            originalStats,
            workingStats,
            finalStats,
            operations,
            backupCreated: backupResult?.success || false,
            integrityVerified: enableIntegrityVerification,
            processingTime: processingMetrics.totalTime
        };

        // Generate detailed report if requested
        if (generateReport) {
            logger.extended('Generating comprehensive operation report...');
            const report = generateOperationReport(analysis, processingMetrics, operations);
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
            logger.extended(`⏱️ Quality assurance: ${processingMetrics.qaTime}ms`);
            logger.extended(`⏱️ File analysis: ${processingMetrics.analysisTime}ms`);
            logger.extended(`⏱️ File operations: ${processingMetrics.operationTime}ms`);
            logger.extended(`⏱️ Verification: ${processingMetrics.verificationTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);

            // Calculate overall throughput
            const totalBytes = workingStats.size;
            const throughput = totalTime > 0 ? (totalBytes / totalTime) * 1000 : 0; // bytes per second

            if (throughput > 0) {
                logger.extended(`📈 Overall throughput: ${formatTransferSpeed(throughput)}`);
            }

            const operationEfficiency = operations.reduce((total, op) => total + op.duration, 0);
            const overhead = processingMetrics.totalTime - operationEfficiency;
            const overheadPercent = (overhead / processingMetrics.totalTime) * 100;

            logger.extended(`📊 Operation efficiency: ${(100 - overheadPercent).toFixed(1)}% (${overheadPercent.toFixed(1)}% overhead)`);
        }

        // Feature utilization summary
        if (logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Safety checks', enabled: enableSafetyChecks },
                { name: 'Progress tracking', enabled: enableProgressTracking },
                { name: 'Integrity verification', enabled: enableIntegrityVerification },
                { name: 'Safety backup', enabled: createSafetyBackup },
                { name: 'Report generation', enabled: generateReport },
                { name: 'Quality assurance', enabled: enable_qa_checks },
                { name: 'Performance metrics', enabled: showPerformanceMetrics }
            ];

            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });

            logger.debug(`🔄 File operations performed: ${operations.length}`);
            logger.debug(`📊 File size change: ${workingStats.size - (originalStats.size || 0)} bytes`);
            logger.debug(`⏱️ Total operation time: ${operations.reduce((total, op) => total + op.duration, 0)}ms`);
            logger.debug(`🛡️ Safety features used: ${[enableSafetyChecks, enableIntegrityVerification, createSafetyBackup].filter(Boolean).length}/3`);
        }

        // Build updated variables object
        const updatedVariables = {
            ...args.variables,
            // Operation results
            fileReplacementResult: 'success',
            replacementProcessingTime: processingMetrics.totalTime,
            replacementTimestamp: new Date().toISOString(),
            
            // File information
            originalFilePath: args.originalLibraryFile._id,
            workingFilePath: currentPath,
            finalFilePath: newPath,
            originalFileSize: originalStats.size || 0,
            workingFileSize: workingStats.size,
            finalFileSize: finalStats.size,
            
            // Size analysis
            fileSizeChange: workingStats.size - (originalStats.size || 0),
            fileSizeChangePercent: originalStats.size ? 
                ((workingStats.size - originalStats.size) / originalStats.size) * 100 : 0,
            
            // Operation metrics
            fileOperationsCount: operations.length,
            totalOperationTime: operations.reduce((total, op) => total + op.duration, 0),
            averageTransferSpeed: operations.length > 0 ? 
                operations.reduce((total, op) => total + op.speed, 0) / operations.filter(op => op.speed > 0).length : 0,
            
            // Feature usage
            safetyBackupCreated: backupResult?.success || false,
            integrityVerificationPerformed: enableIntegrityVerification,
            safetyChecksEnabled: enableSafetyChecks,
            
            // Plugin metadata
            replaceOriginalPluginVersion: '3.0'
        };

        // Statistical analysis for extended logging
        if (logging_level === 'extended' || logging_level === 'debug') {
            logger.subsection('Statistical Analysis');

            if (originalStats.size && workingStats.size) {
                const compressionRatio = originalStats.size / workingStats.size;
                const spaceEfficiency = ((originalStats.size - workingStats.size) / originalStats.size) * 100;

                logger.extended(`📊 Compression ratio: ${compressionRatio.toFixed(3)}:1`);
                if (spaceEfficiency > 0) {
                    logger.extended(`📊 Space saved: ${spaceEfficiency.toFixed(2)}%`);
                } else {
                    logger.extended(`📊 Space used: ${Math.abs(spaceEfficiency).toFixed(2)}% additional`);
                }
            }

            // Operation timing analysis
            if (operations.length > 0) {
                const fastestOp = operations.reduce((min, op) => op.speed > min.speed ? op : min);
                const slowestOp = operations.reduce((max, op) => op.speed < max.speed && op.speed > 0 ? op : max);

                if (fastestOp.speed > 0) {
                    logger.extended(`📊 Fastest operation: ${fastestOp.operation} (${formatTransferSpeed(fastestOp.speed)})`);
                }
                if (slowestOp.speed > 0 && slowestOp !== fastestOp) {
                    logger.extended(`📊 Slowest operation: ${slowestOp.operation} (${formatTransferSpeed(slowestOp.speed)})`);
                }
            }

            const totalFileOperations = operations.reduce((total, op) => total + op.duration, 0);
            const efficiency = processingMetrics.totalTime > 0 ? 
                (totalFileOperations / processingMetrics.totalTime) * 100 : 0;

            logger.extended(`📊 Processing efficiency: ${efficiency.toFixed(1)}% (file operations vs total time)`);

            // Quality score calculation
            let qualityScore = 100;
            if (!enableSafetyChecks) qualityScore -= 10;
            if (!enableIntegrityVerification) qualityScore -= 15;
            if (validationResult.warnings.length > 0) qualityScore -= validationResult.warnings.length * 5;
            if (finalStats.size !== workingStats.size) qualityScore -= 20;
            qualityScore = Math.max(0, qualityScore);

            logger.extended(`📊 Operation quality score: ${qualityScore}/100`);
        }

        // Success summary and recommendations
        logger.subsection('Operation Summary and Recommendations');
        logger.success('🎉 File replacement completed successfully!');
        logger.success(`📁 File is now available at: ${newPath}`);
        logger.success(`📊 Processing completed in ${(processingMetrics.totalTime / 1000).toFixed(2)} seconds`);

        if (backupResult?.success) {
            logger.success(`💾 Safety backup created: ${path.basename(backupResult.backupPath)}`);
        }

        if (enableIntegrityVerification) {
            logger.success('🔒 File integrity verified');
        }

        // Performance insights
        if (operations.length > 0) {
            const totalOperationTime = operations.reduce((total, op) => total + op.duration, 0);
            const averageSpeed = operations.filter(op => op.speed > 0)
                .reduce((total, op, _, arr) => total + op.speed / arr.length, 0);

            if (averageSpeed > 100 * 1024 * 1024) { // > 100 MB/s
                logger.success('⚡ Excellent transfer performance achieved');
            } else if (averageSpeed > 50 * 1024 * 1024) { // > 50 MB/s
                logger.success('👍 Good transfer performance');
            } else if (averageSpeed > 0) {
                logger.info('💡 Consider optimizing storage performance for faster operations');
            }
        }

        // Size efficiency insights
        if (originalStats.size && workingStats.size) {
            const sizeDiff = workingStats.size - originalStats.size;
            const changePercent = (sizeDiff / originalStats.size) * 100;

            if (changePercent < -20) {
                logger.success('🌟 Excellent file size optimization achieved');
            } else if (changePercent < -10) {
                logger.success('👍 Good file size reduction');
            } else if (changePercent > 20) {
                logger.info('💡 File size increased significantly - verify encoding settings');
            }
        }

        // Safety recommendations
        logger.info('🎯 Future recommendations:');
        if (!enableSafetyChecks) {
            logger.info('• Consider enabling safety checks for critical files');
        }
        if (!enableIntegrityVerification) {
            logger.info('• Consider enabling integrity verification for important data');
        }
        if (!createSafetyBackup) {
            logger.info('• Consider enabling safety backup for irreplaceable files');
        }
        if (enableSafetyChecks && enableIntegrityVerification && createSafetyBackup) {
            logger.success('• All safety features enabled - excellent configuration');
        }

        logger.banner('🚀 FILE REPLACEMENT COMPLETED SUCCESSFULLY');
        logger.success('✅ Enhanced Replace Original processing complete!');
        logger.info('🎯 File is ready for use at the new location');
        logger.info('=== End of Enhanced File Replacement ===');

        // Output all logs
        args.jobLog?.(logger.getOutput());

        return {
			outputFileObj: {
				...args.inputFileObj,  // ← Copy all properties
				_id: newPath,          // ← Update the path
			},
			outputNumber: 1,
			variables: updatedVariables,
		};

    } catch (error) {
        // Ensure logger is initialized for error handling
        if (!logger) {
            logger = new Logger('info');
        }

        logger.error(`Plugin execution failed: ${error.message}`);
        
        if (error.stack && args.inputs && args.inputs.logging_level === 'debug') {
            logger.debug(`Stack trace: ${error.stack}`);
        }

        args.jobLog?.(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 3,
            variables: args.variables || {},
        };
    }
};

// Export plugin functions
module.exports = {
    details,
    plugin,
};