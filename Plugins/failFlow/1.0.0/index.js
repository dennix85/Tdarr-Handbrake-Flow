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

// Plugin details with enhanced bright red glow
const details = () => ({
    name: '💥 DeNiX Enhanced Fail Flow: Controlled Error Generation & Flow Termination',
    description: 'Advanced flow failure plugin with detailed diagnostic logging, comprehensive error context generation, and intelligent failure simulation. Designed for testing, debugging, and controlled flow termination with enhanced error reporting.',
    style: {
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderWidth: '3px',
        borderStyle: 'solid',
        // Enhanced bright red glow with 10 layers - expanded reach with graduated opacity
        boxShadow: `
            0 0 10px rgba(244, 67, 54, 0.5),
            0 0 25px rgba(244, 67, 54, 0.46),
            0 0 40px rgba(244, 67, 54, 0.42),
            0 0 55px rgba(244, 67, 54, 0.39),
            0 0 70px rgba(244, 67, 54, 0.35),
            0 0 85px rgba(244, 67, 54, 0.31),
            0 0 100px rgba(244, 67, 54, 0.27),
            0 0 115px rgba(244, 67, 54, 0.23),
            0 0 130px rgba(244, 67, 54, 0.19),
            0 0 145px rgba(244, 67, 54, 0.17),
            0 0 160px rgba(244, 67, 54, 0.15),
            inset 0 0 20px rgba(244, 67, 54, 0.4)
        `,
        // Alternative massive expansion glow (uncomment for even more spread)
        // boxShadow: '0 0 150px rgba(244, 67, 54, 0.8), 0 0 200px rgba(244, 67, 54, 0.6), inset 0 0 30px rgba(244, 67, 54, 0.5)',
        
        background: 'linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(211, 47, 47, 0.1))',
    },
    tags: 'testing,debug,error,failure,diagnostic,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '💥',
    inputs: [
        {
            label: '📝 Custom Error Message',
            name: 'customErrorMessage',
            type: 'string',
            defaultValue: 'Controlled flow failure triggered by Enhanced Fail Flow plugin',
            inputUI: { type: 'text' },
            tooltip: 'Custom error message to include in the failure. Useful for identifying specific test scenarios.',
        },
        {
            label: '🏷️ Failure Category',
            name: 'failureCategory',
            type: 'string',
            defaultValue: 'testing',
            inputUI: {
                type: 'dropdown',
                options: [
                    'testing',
                    'debugging',
                    'validation',
                    'simulation',
                    'custom',
                ],
            },
            tooltip: 'Categorize the type of failure for better error classification and reporting',
        },
        {
            label: '🎯 Custom Category Name',
            name: 'customCategoryName',
            type: 'string',
            defaultValue: 'custom_failure',
            inputUI: { 
                type: 'text',
                displayConditions: {
                    conditions: [
                        {
                            name: 'failureCategory',
                            value: 'custom',
                        },
                    ],
                },
            },
            tooltip: 'Custom category name when "custom" is selected. Use descriptive names like "integration_test", "load_test", etc.',
        },
        {
            label: '📊 Include Diagnostics',
            name: 'includeDiagnostics',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Include comprehensive diagnostic information in error context (memory usage, timing, system info)',
        },
        {
            label: '⏱️ Failure Delay (ms)',
            name: 'failureDelay',
            type: 'number',
            defaultValue: 0,
            inputUI: { type: 'text' },
            tooltip: 'Delay before triggering failure in milliseconds. Useful for timing-related testing (0 = immediate)',
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
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Display processing timing and performance statistics before failure',
        },
        {
            label: '🔍 Analyze Variables',
            name: 'analyzeVariables',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Perform detailed analysis of flow variables before failure for debugging purposes',
        },
    ],
    outputs: [
        // This plugin intentionally has no outputs as it always throws an error
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

    critical(message) {
        this.output.push(`💥 ${message}`);
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

// Format bytes helper
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Get comprehensive system diagnostics
const getSystemDiagnostics = () => {
    const os = require('os');
    
    const diagnostics = {
        system: {
            platform: os.platform(),
            arch: os.arch(),
            hostname: os.hostname(),
            release: os.release(),
            uptime: Math.floor(os.uptime()),
            loadavg: os.loadavg()
        },
        memory: {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem(),
            usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
        },
        process: {
            nodeVersion: process.version,
            pid: process.pid,
            ppid: process.ppid,
            cwd: process.cwd(),
            execPath: process.execPath,
            uptime: Math.floor(process.uptime())
        },
        cpu: {
            cores: os.cpus().length,
            model: os.cpus()[0]?.model || 'Unknown',
            speed: os.cpus()[0]?.speed || 0
        }
    };
    
    // Add process memory usage if available
    if (process.memoryUsage) {
        const memUsage = process.memoryUsage();
        diagnostics.processMemory = {
            rss: memUsage.rss,
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            external: memUsage.external
        };
    }
    
    return diagnostics;
};

// Analyze flow variables for debugging
const analyzeFlowVariables = (variables, logger) => {
    if (!variables || typeof variables !== 'object') {
        logger.warn('No variables to analyze or invalid variables object');
        return {
            totalVariables: 0,
            variableTypes: {},
            analysis: 'No variables found'
        };
    }
    
    const analysis = {
        totalVariables: Object.keys(variables).length,
        variableTypes: {},
        variablesList: [],
        analysis: ''
    };
    
    // Analyze each variable
    Object.keys(variables).forEach(key => {
        const value = variables[key];
        const type = typeof value;
        
        analysis.variableTypes[type] = (analysis.variableTypes[type] || 0) + 1;
        analysis.variablesList.push({
            key: key,
            type: type,
            value: type === 'object' ? '[Object]' : String(value).substring(0, 100)
        });
        
        logger.debug(`Variable "${key}": ${type} = ${type === 'object' ? '[Object]' : String(value).substring(0, 50)}`);
    });
    
    // Generate analysis summary
    const typesSummary = Object.keys(analysis.variableTypes)
        .map(type => `${analysis.variableTypes[type]} ${type}`)
        .join(', ');
    
    analysis.analysis = `Found ${analysis.totalVariables} variables: ${typesSummary}`;
    
    logger.extended(`Variable analysis: ${analysis.analysis}`);
    
    return analysis;
};

// Analyze input file for debugging
const analyzeInputFile = (inputFileObj, logger) => {
    if (!inputFileObj) {
        logger.warn('No input file object to analyze');
        return {
            hasFile: false,
            analysis: 'No input file provided'
        };
    }
    
    const analysis = {
        hasFile: true,
        fileName: inputFileObj.file || 'Unknown',
        fileSize: inputFileObj.size || 0,
        container: inputFileObj.container || 'Unknown',
        fileMedium: inputFileObj.fileMedium || 'Unknown',
        properties: Object.keys(inputFileObj).length,
        analysis: ''
    };
    
    logger.extended(`Input file: ${analysis.fileName}`);
    logger.extended(`File size: ${analysis.fileSize ? formatBytes(analysis.fileSize) : 'Unknown'}`);
    logger.extended(`Container: ${analysis.container}`);
    logger.extended(`Medium: ${analysis.fileMedium}`);
    logger.extended(`Properties count: ${analysis.properties}`);
    
    // Check for ffProbe data
    if (inputFileObj.ffProbeData) {
        analysis.hasFFProbeData = true;
        analysis.streamCount = inputFileObj.ffProbeData.streams ? inputFileObj.ffProbeData.streams.length : 0;
        logger.extended(`FFProbe streams: ${analysis.streamCount}`);
    } else {
        analysis.hasFFProbeData = false;
        logger.debug('No FFProbe data available');
    }
    
    analysis.analysis = `File: ${analysis.fileName} (${analysis.fileSize ? formatBytes(analysis.fileSize) : 'Unknown size'}) - ${analysis.container} container`;
    
    return analysis;
};

// Create comprehensive error context
const createErrorContext = (args, inputs, diagnostics, variableAnalysis, fileAnalysis, executionTime, actualCategory) => {
    return {
        plugin: {
            name: 'DeNiX Enhanced Fail Flow',
            version: '2.11.01',
            category: actualCategory,
            isCustomCategory: inputs.failureCategory === 'custom',
            customMessage: inputs.customErrorMessage
        },
        execution: {
            timestamp: new Date().toISOString(),
            executionTime: executionTime,
            delay: inputs.failureDelay,
            intentional: true
        },
        file: fileAnalysis,
        variables: variableAnalysis,
        diagnostics: inputs.includeDiagnostics ? diagnostics : null,
        settings: {
            loggingLevel: inputs.logging_level,
            performanceMetrics: inputs.showPerformanceMetrics,
            variableAnalysis: inputs.analyzeVariables,
            diagnosticsEnabled: inputs.includeDiagnostics
        }
    };
};

// Sleep helper for delay functionality
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
            diagnosticsTime: 0,
            analysisTime: 0,
            delayTime: 0,
            totalTime: 0
        };

        // Extract inputs using destructuring
        const {
            customErrorMessage,
            failureCategory,
            customCategoryName,
            includeDiagnostics,
            failureDelay,
            logging_level,
            showPerformanceMetrics,
            analyzeVariables
        } = args.inputs;

        // Determine the actual category to use
        const actualCategory = failureCategory === 'custom' ? customCategoryName : failureCategory;

        logger.section('DeNiX Enhanced Fail Flow: Controlled Error Generation & Flow Termination');
        logger.critical('🚨 INTENTIONAL FAILURE MODE ACTIVATED 🚨');

        // ===============================================
        // STEP 1: INITIALIZATION AND CONFIGURATION
        // ===============================================
        
        logger.subsection('Step 1: Initialization and configuration');
        const initStartTime = Date.now();

        logger.info(`💥 Plugin: Enhanced Fail Flow`);
        logger.info(`🏷️ Category: ${actualCategory}${failureCategory === 'custom' ? ' (custom)' : ''}`);
        logger.info(`📝 Message: ${customErrorMessage}`);
        logger.info(`⏱️ Delay: ${failureDelay}ms`);
        logger.info(`📊 Logging: ${logging_level}`);

        // Configuration validation
        if (failureDelay < 0 || failureDelay > 30000) {
            logger.warn(`Invalid delay value: ${failureDelay}ms. Clamping to valid range (0-30000ms)`);
        }

        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: SYSTEM DIAGNOSTICS COLLECTION
        // ===============================================
        
        let diagnostics = null;
        if (includeDiagnostics) {
            logger.subsection('Step 2: System diagnostics collection');
            const diagnosticsStartTime = Date.now();

            diagnostics = getSystemDiagnostics();
            
            logger.extended(`🖥️ Platform: ${diagnostics.system.platform} (${diagnostics.system.arch})`);
            logger.extended(`🏠 Hostname: ${diagnostics.system.hostname}`);
            logger.extended(`⚡ Node.js: ${diagnostics.process.nodeVersion}`);
            logger.extended(`🖥️ CPU: ${diagnostics.cpu.cores} cores - ${diagnostics.cpu.model}`);
            logger.extended(`💾 Memory: ${formatBytes(diagnostics.memory.used)} / ${formatBytes(diagnostics.memory.total)} (${diagnostics.memory.usagePercent}%)`);
            logger.extended(`⏱️ System uptime: ${Math.floor(diagnostics.system.uptime / 3600)}h ${Math.floor((diagnostics.system.uptime % 3600) / 60)}m`);
            
            if (diagnostics.processMemory) {
                logger.debug(`🔍 Process memory - RSS: ${formatBytes(diagnostics.processMemory.rss)}, Heap: ${formatBytes(diagnostics.processMemory.heapUsed)}/${formatBytes(diagnostics.processMemory.heapTotal)}`);
            }

            processingMetrics.diagnosticsTime = Date.now() - diagnosticsStartTime;
        } else {
            logger.info('⏭️ Step 2: System diagnostics collection disabled');
        }

        // ===============================================
        // STEP 3: FLOW DATA ANALYSIS
        // ===============================================
        
        logger.subsection('Step 3: Flow data analysis');
        const analysisStartTime = Date.now();

        // Analyze input file
        const fileAnalysis = analyzeInputFile(args.inputFileObj, logger);

        // Analyze variables if enabled
        let variableAnalysis = { totalVariables: 0, analysis: 'Variable analysis disabled' };
        if (analyzeVariables) {
            variableAnalysis = analyzeFlowVariables(args.variables, logger);
        } else {
            logger.info('Variable analysis disabled');
        }

        processingMetrics.analysisTime = Date.now() - analysisStartTime;

        // ===============================================
        // STEP 4: DELAY PROCESSING (IF CONFIGURED)
        // ===============================================
        
        if (failureDelay > 0) {
            logger.subsection('Step 4: Failure delay processing');
            const delayStartTime = Date.now();

            const clampedDelay = Math.max(0, Math.min(30000, failureDelay));
            logger.warn(`⏸️ Delaying failure by ${clampedDelay}ms...`);
            
            yield sleep(clampedDelay);
            
            logger.warn('⏰ Delay completed - proceeding with failure');

            processingMetrics.delayTime = Date.now() - delayStartTime;
        } else {
            logger.info('⏭️ Step 4: No delay configured - proceeding immediately');
        }

        // ===============================================
        // STEP 5: ERROR GENERATION AND FAILURE
        // ===============================================
        
        processingMetrics.totalTime = Date.now() - startTime;

        logger.subsection('Step 5: Error generation and controlled failure');

        // Performance metrics before failure
        if (showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics (Pre-Failure)');
            logger.extended(`⏱️ Initialization: ${processingMetrics.initializationTime}ms`);
            logger.extended(`⏱️ Diagnostics collection: ${processingMetrics.diagnosticsTime}ms`);
            logger.extended(`⏱️ Flow analysis: ${processingMetrics.analysisTime}ms`);
            logger.extended(`⏱️ Delay processing: ${processingMetrics.delayTime}ms`);
            logger.extended(`⏱️ Total execution: ${totalTime.toFixed(2)}ms`);
            
            const efficiency = totalTime > 0 ? Math.round((1000 / totalTime) * 100) / 100 : 0;
            logger.extended(`📈 Processing efficiency: ${efficiency} operations/second`);
        }

        // Feature utilization summary
        if (logging_level === 'debug') {
            logger.subsection('Feature Utilization (Pre-Failure)');
            const features = [
                { name: 'System diagnostics', enabled: includeDiagnostics },
                { name: 'Variable analysis', enabled: analyzeVariables },
                { name: 'Performance metrics', enabled: showPerformanceMetrics },
                { name: 'Failure delay', enabled: failureDelay > 0 },
                { name: 'Custom error message', enabled: customErrorMessage !== details().inputs[0].defaultValue },
                { name: 'Custom category', enabled: failureCategory === 'custom' }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
        }

        // Create comprehensive error context
        const errorContext = createErrorContext(
            args,
            args.inputs,
            diagnostics,
            variableAnalysis,
            fileAnalysis,
            processingMetrics.totalTime,
            actualCategory
        );

        // Final warnings before failure
        logger.critical('🚨 PREPARING FOR CONTROLLED FAILURE 🚨');
        logger.error(`💥 Error category: ${actualCategory.toUpperCase()}${failureCategory === 'custom' ? ' (CUSTOM)' : ''}`);
        logger.error(`📝 Error message: ${customErrorMessage}`);
        logger.warn('⚠️ This failure is intentional and controlled');

        // Output all logs before throwing error
        args.jobLog(logger.getOutput());

        // Create enhanced error object
        const error = new Error(customErrorMessage);
        error.name = 'EnhancedFailFlowError';
        error.category = actualCategory;
        error.isCustomCategory = failureCategory === 'custom';
        error.context = errorContext;
        error.isIntentional = true;
        error.pluginName = 'DeNiX Enhanced Fail Flow';
        error.timestamp = new Date().toISOString();

        // Log final error information to console for debugging
        console.error('💥 Enhanced Fail Flow - Throwing intentional error:', {
            message: customErrorMessage,
            category: actualCategory,
            isCustomCategory: failureCategory === 'custom',
            executionTime: processingMetrics.totalTime,
            hasContext: !!errorContext
        });

        // Throw the enhanced error
        throw error;

    } catch (error) {
        // If this is our intentional error, re-throw it
        if (error.isIntentional) {
            throw error;
        }
        
        // If this is an unexpected error during setup, create a fallback error
        const logger = new Logger('info');
        logger.error(`Unexpected error in Enhanced Fail Flow plugin: ${error.message}`);
        args.jobLog(logger.getOutput());
        
        const fallbackError = new Error(`Enhanced Fail Flow plugin encountered unexpected error: ${error.message}`);
        fallbackError.name = 'EnhancedFailFlowUnexpectedError';
        fallbackError.originalError = error;
        fallbackError.isIntentional = false;
        fallbackError.pluginName = 'DeNiX Enhanced Fail Flow';
        
        throw fallbackError;
    }
});

exports.plugin = plugin;