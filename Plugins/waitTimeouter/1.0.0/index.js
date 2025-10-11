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
    name: '⏰ DeNiX Enhanced Wait: Advanced Timing & Progress Control',
    description: 'Advanced wait plugin with intelligent progress tracking, milestone notifications, comprehensive logging, and enhanced timing controls. Features real-time progress visualization, performance monitoring, and detailed execution analytics.',
    style: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        // Enhanced bright gold glow with 10 layers - expanded reach with graduated opacity
        boxShadow: `
            0 0 10px rgba(255, 215, 0, 0.5),
            0 0 25px rgba(255, 215, 0, 0.46),
            0 0 40px rgba(255, 215, 0, 0.42),
            0 0 55px rgba(255, 215, 0, 0.39),
            0 0 70px rgba(255, 215, 0, 0.35),
            0 0 85px rgba(255, 215, 0, 0.31),
            0 0 100px rgba(255, 215, 0, 0.27),
            0 0 115px rgba(255, 215, 0, 0.23),
            0 0 130px rgba(255, 215, 0, 0.19),
            0 0 145px rgba(255, 215, 0, 0.17),
            0 0 160px rgba(255, 215, 0, 0.15),
            inset 0 0 20px rgba(255, 215, 0, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 247, 0, 0.1))',
    },
    tags: 'utility,timing,delay,progress,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '⏰',
    inputs: [
        {
            label: '⏱️ Amount',
            name: 'amount',
            type: 'string',
            defaultValue: '1',
            inputUI: { type: 'text' },
            tooltip: 'Amount of time to wait (supports decimals like 1.5, 2.75, etc.)',
        },
        {
            label: '📅 Time Unit',
            name: 'unit',
            type: 'string',
            defaultValue: 'seconds',
            inputUI: {
                type: 'dropdown',
                options: ['milliseconds', 'seconds', 'minutes', 'hours'],
            },
            tooltip: 'Unit of time for the wait duration',
        },
        {
            label: '📊 Progress Tracking',
            name: 'progress_tracking',
            type: 'string',
            defaultValue: 'detailed',
            inputUI: {
                type: 'dropdown',
                options: ['none', 'simple', 'detailed', 'advanced'],
            },
            tooltip: 'Progress tracking level: none (silent), simple (basic updates), detailed (progress bar), advanced (full analytics)',
        },
        {
            label: '🔄 Update Interval (seconds)',
            name: 'update_interval',
            type: 'number',
            defaultValue: 2,
            inputUI: { type: 'text' },
            tooltip: 'How often to show progress updates in seconds. Default: 2 seconds',
        },
        {
            label: '💬 Custom Message',
            name: 'custom_message',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Optional custom message to display during wait operation',
        },
        {
            label: '🎯 Milestone Notifications',
            name: 'milestone_notifications',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Show special notifications at 25%, 50%, 75% completion milestones',
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
            tooltip: '✅ Continue to next plugin - Wait completed successfully',
        },
        {
            number: 2,
            tooltip: '⚠️ Skipped - Zero wait time or validation failed',
        },
        {
            number: 3,
            tooltip: '❌ Error occurred during wait operation',
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
        this.output.push(`⚡ ${message}`);
    }

    milestone(message) {
        this.output.push(`🎯 ${message}`);
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

// Enhanced progress bar creation
const createProgressBar = (current, total, width = 30) => {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    const filledChar = '█';
    const emptyChar = '░';
    const bar = filledChar.repeat(filled) + emptyChar.repeat(empty);
    
    return `[${bar}] ${percentage.toFixed(1)}%`;
};

// Format time duration with enhanced precision
const formatDuration = (milliseconds, showMillis = false) => {
    if (milliseconds < 0) return '0s';
    
    const ms = milliseconds % 1000;
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m `;
    if (seconds > 0 || minutes > 0 || hours > 0) {
        result += showMillis ? `${seconds}.${ms.toString().padStart(3, '0')}s` : `${seconds}s`;
    } else if (showMillis) {
        result = `${ms}ms`;
    } else {
        result = '0s';
    }
    
    return result.trim();
};

// Calculate estimated completion time
const calculateETA = (startTime, current, total) => {
    if (current <= 0) return null;
    
    const elapsed = Date.now() - startTime;
    const rate = current / elapsed;
    const remaining = total - current;
    const eta = remaining / rate;
    
    return new Date(Date.now() + eta);
};

// Quality assurance validation
const performQualityAssurance = (inputs, logger) => {
    const result = {
        canProcess: true,
        errorMessage: '',
        warnings: []
    };

    if (!inputs.enable_qa_checks) {
        logger.debug('Quality assurance checks disabled');
        return result;
    }

    try {
        // Validate amount
        const amount = Number(inputs.amount);
        if (isNaN(amount) || amount < 0) {
            result.canProcess = false;
            result.errorMessage = `Invalid amount: '${inputs.amount}'. Must be a positive number.`;
            return result;
        }

        // Validate unit
        const validUnits = ['milliseconds', 'seconds', 'minutes', 'hours'];
        if (!validUnits.includes(inputs.unit)) {
            result.canProcess = false;
            result.errorMessage = `Invalid unit: '${inputs.unit}'. Must be one of: ${validUnits.join(', ')}`;
            return result;
        }

        // Validate update interval
        const interval = Number(inputs.update_interval);
        if (isNaN(interval) || interval <= 0) {
            result.warnings.push(`Invalid update interval: ${inputs.update_interval}. Using default: 2 seconds`);
        }

        // Check for very long waits
        const multipliers = { milliseconds: 1, seconds: 1000, minutes: 60000, hours: 3600000 };
        const totalMs = amount * multipliers[inputs.unit];
        
        if (totalMs > 3600000) { // > 1 hour
            result.warnings.push('Wait time exceeds 1 hour - ensure this is intentional');
        }
        
        if (totalMs > 86400000) { // > 24 hours
            result.warnings.push('Wait time exceeds 24 hours - consider breaking into smaller waits');
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
            waitTime: 0,
            totalTime: 0
        };

        logger.banner('⏰ ENHANCED WAIT v3.0 STARTING');
        logger.section('DeNiX Enhanced Wait: Advanced Timing & Progress Control');

        // ===============================================
        // STEP 1: INITIALIZATION AND VALIDATION
        // ===============================================
        
        logger.subsection('Step 1: Initialization and input validation');
        const initStartTime = Date.now();
        
        const {
            amount,
            unit,
            progress_tracking,
            update_interval,
            custom_message,
            milestone_notifications,
            enable_qa_checks,
            logging_level,
            showPerformanceMetrics
        } = args.inputs;

        logger.extended(`Wait configuration: ${amount} ${unit}`);
        logger.extended(`Progress tracking: ${progress_tracking}`);
        logger.extended(`Update interval: ${update_interval} seconds`);
        logger.extended(`Milestone notifications: ${milestone_notifications ? 'Enabled' : 'Disabled'}`);

        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        
        logger.subsection('Step 2: Quality assurance and validation');
        const qaStartTime = Date.now();
        
        const validationResult = performQualityAssurance(args.inputs, logger);
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
        // STEP 3: WAIT TIME CALCULATION
        // ===============================================
        
        const amountNum = Number(amount);
        
        // Handle zero wait time
        if (amountNum === 0) {
            logger.warn('Wait amount is 0 - skipping wait operation');
            logger.success('✅ Enhanced Wait processing complete (zero duration)!');
            
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        // Calculate wait time in milliseconds
        const multipliers = {
            milliseconds: 1,
            seconds: 1000,
            minutes: 60000,
            hours: 3600000
        };
        
        const waitTimeMs = Math.round(amountNum * multipliers[unit]);
        const updateIntervalMs = Math.max(100, (Number(update_interval) || 2) * 1000);
        
        logger.info(`⏱️ Wait duration: ${formatDuration(waitTimeMs, true)}`);
        logger.info(`📅 Start time: ${new Date().toLocaleString()}`);
        logger.info(`🎯 Expected completion: ${new Date(Date.now() + waitTimeMs).toLocaleString()}`);
        
        if (custom_message) {
            logger.info(`💬 Custom message: "${custom_message}"`);
        }

        // ===============================================
        // STEP 4: WAIT OPERATION WITH PROGRESS TRACKING
        // ===============================================
        
        logger.subsection('Step 4: Executing wait operation with progress tracking');
        const waitStartTime = Date.now();
        
        let finished = false;
        let lastMilestone = 0;
        
        // Set up progress tracking based on level
        const setupProgressTracking = () => {
            if (progress_tracking === 'none') {
                return null;
            }
            
            const progressInterval = setInterval(() => {
                if (finished) {
                    clearInterval(progressInterval);
                    return;
                }
                
                const elapsed = Date.now() - waitStartTime;
                const remaining = Math.max(0, waitTimeMs - elapsed);
                const progressPercent = Math.min(100, (elapsed / waitTimeMs) * 100);
                
                // Progress tracking based on level
                if (progress_tracking === 'simple') {
                    logger.progress(`Waiting... ${formatDuration(remaining)} remaining (${progressPercent.toFixed(1)}%)`);
                    
                } else if (progress_tracking === 'detailed') {
                    const progressBar = createProgressBar(elapsed, waitTimeMs);
                    logger.progress(`${progressBar} | Remaining: ${formatDuration(remaining)}`);
                    
                } else if (progress_tracking === 'advanced') {
                    const progressBar = createProgressBar(elapsed, waitTimeMs);
                    const eta = calculateETA(waitStartTime, elapsed, waitTimeMs);
                    const etaString = eta ? eta.toLocaleTimeString() : 'Calculating...';
                    
                    logger.progress(`${progressBar} | ETA: ${etaString} | Remaining: ${formatDuration(remaining)}`);
                    
                    // Advanced metrics
                    if (args.inputs.logging_level === 'debug') {
                        const efficiency = (elapsed / waitTimeMs) * 100;
                        logger.debug(`Efficiency: ${efficiency.toFixed(2)}% | Elapsed: ${formatDuration(elapsed)}`);
                    }
                }
                
                // Milestone notifications
                if (milestone_notifications) {
                    const currentMilestone = Math.floor(progressPercent / 25) * 25;
                    if (currentMilestone > lastMilestone && currentMilestone > 0 && currentMilestone < 100) {
                        lastMilestone = currentMilestone;
                        logger.milestone(`🎯 Milestone reached: ${currentMilestone}% complete`);
                        
                        if (currentMilestone === 50) {
                            logger.milestone('🏁 Halfway point reached!');
                        } else if (currentMilestone === 75) {
                            logger.milestone('🚀 Three quarters complete - final stretch!');
                        }
                    }
                }
                
            }, updateIntervalMs);
            
            return progressInterval;
        };
        
        const progressInterval = setupProgressTracking();
        
        // Display initial wait message
        const waitMessage = custom_message || 'Wait operation in progress...';
        logger.info(`⏳ ${waitMessage}`);
        
        // Perform the actual wait
        yield new Promise(resolve => setTimeout(resolve, waitTimeMs));
        
        finished = true;
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        processingMetrics.waitTime = Date.now() - waitStartTime;

        // ===============================================
        // STEP 5: COMPLETION AND RESULTS
        // ===============================================
        
        processingMetrics.totalTime = Date.now() - startTime;
        
        logger.subsection('Step 5: Wait operation completion and analysis');
        
        const actualDuration = Date.now() - waitStartTime;
        const accuracy = ((actualDuration / waitTimeMs) * 100).toFixed(2);
        const drift = actualDuration - waitTimeMs;
        
        logger.success('🎉 Wait operation completed successfully!');
        logger.success(`⏱️ Requested duration: ${formatDuration(waitTimeMs, true)}`);
        logger.success(`⏱️ Actual duration: ${formatDuration(actualDuration, true)}`);
        logger.extended(`🎯 Timing accuracy: ${accuracy}%`);
        logger.extended(`📊 Time drift: ${drift > 0 ? '+' : ''}${drift}ms`);
        
        if (Math.abs(drift) > 100) {
            logger.warn(`⚠️ Significant timing drift detected: ${drift}ms`);
        } else {
            logger.success('✅ Excellent timing precision achieved');
        }

        // Performance metrics
        if (showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Initialization: ${processingMetrics.initializationTime}ms`);
            logger.extended(`⏱️ Quality assurance: ${processingMetrics.qaTime}ms`);
            logger.extended(`⏱️ Wait operation: ${processingMetrics.waitTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            const overhead = totalTime - processingMetrics.waitTime;
            const overheadPercent = ((overhead / totalTime) * 100).toFixed(2);
            logger.extended(`📊 Processing overhead: ${overhead.toFixed(2)}ms (${overheadPercent}%)`);
        }

        // Feature utilization summary
        if (args.inputs.logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Progress tracking', enabled: progress_tracking !== 'none' },
                { name: 'Milestone notifications', enabled: milestone_notifications },
                { name: 'Quality assurance', enabled: enable_qa_checks },
                { name: 'Performance metrics', enabled: showPerformanceMetrics },
                { name: 'Custom message', enabled: !!custom_message }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`⏱️ Wait precision: ${accuracy}% accurate`);
            logger.debug(`📊 Progress updates: ${progress_tracking}`);
            logger.debug(`🔄 Update interval: ${update_interval}s`);
        }

        // Enhanced variables
        const updatedVariables = {
            ...args.variables,
            
            // Wait operation metadata
            wait_completed: true,
            wait_requested_duration_ms: waitTimeMs,
            wait_actual_duration_ms: actualDuration,
            wait_timing_accuracy_percent: parseFloat(accuracy),
            wait_drift_ms: drift,
            wait_start_time: new Date(waitStartTime).toISOString(),
            wait_end_time: new Date().toISOString(),
            
            // Configuration metadata
            wait_progress_tracking: progress_tracking,
            wait_milestone_notifications: milestone_notifications,
            wait_custom_message: custom_message || null,
            
            // Performance metadata
            wait_processing_time: processingMetrics.totalTime,
            wait_timestamp: new Date().toISOString(),
            wait_plugin_version: '3.0'
        };

        logger.banner('🚀 WAIT OPERATION COMPLETED SUCCESSFULLY');
        logger.success('✅ All timing objectives achieved');
        logger.success('🎯 Ready to continue processing');
        logger.info('▶️ Proceeding to next plugin...');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
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