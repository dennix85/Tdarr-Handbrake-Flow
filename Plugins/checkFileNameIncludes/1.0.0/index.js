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
const fileUtils_1 = require("../../../../FlowHelpers/1.0.0/fileUtils");

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details
const details = () => ({
    name: '🔍 DeNiX Enhanced File Name Checker: Advanced Pattern Matching & Skip Processing',
    description: 'Enhanced file name checker with intelligent pattern matching, regex support, comprehensive logging, and skip term processing. Features confidence scoring, multiple pattern types, and detailed analysis for flow control decisions.',
    style: {
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        // Enhanced bright orange glow with 10 layers - expanded reach with graduated opacity
        boxShadow: `
            0 0 10px rgba(255, 152, 0, 0.5),
            0 0 25px rgba(255, 152, 0, 0.46),
            0 0 40px rgba(255, 152, 0, 0.42),
            0 0 55px rgba(255, 152, 0, 0.39),
            0 0 70px rgba(255, 152, 0, 0.35),
            0 0 85px rgba(255, 152, 0, 0.31),
            0 0 100px rgba(255, 152, 0, 0.27),
            0 0 115px rgba(255, 152, 0, 0.23),
            0 0 130px rgba(255, 152, 0, 0.19),
            0 0 145px rgba(255, 152, 0, 0.17),
            0 0 160px rgba(255, 152, 0, 0.15),
            inset 0 0 20px rgba(255, 152, 0, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(255, 152, 0, 0.1), rgba(255, 111, 0, 0.1))',
    },
    tags: 'conditional,filename,pattern,skip,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🔍',
    inputs: [
        {
            label: '📁 File to Check',
            name: 'fileToCheck',
            type: 'string',
            defaultValue: 'workingFile',
            inputUI: {
                type: 'dropdown',
                options: [
                    'workingFile',
                    'originalFile',
                ],
            },
            tooltip: 'Specify which file path to check: workingFile (current processing file) or originalFile (source library file)',
        },
        {
            label: '🏷️ Search Terms',
            name: 'terms',
            type: 'string',
            defaultValue: '[TDARR],_720p,_1080p',
            inputUI: { type: 'text' },
            tooltip: 'Comma-separated list of terms to search for (e.g., [TDARR],_720p,_1080p,processed). Case-sensitive exact matching.',
        },
        {
            label: '🔤 Case Sensitive',
            name: 'caseSensitive',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable case-sensitive matching for search terms. Disable for case-insensitive matching.',
        },
        {
            label: '📝 Regex Pattern',
            name: 'pattern',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Advanced regex pattern for complex matching (e.g., ^.*\\[TDARR\\].*mkv$, .*_\\d{3,4}p.*). Leave empty to disable regex.',
        },
        {
            label: '📂 Include File Directory',
            name: 'includeFileDirectory',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Include full directory path in search instead of just filename. Useful for path-based filtering.',
        },
        {
            label: '⏭️ Skip Mode (Set to Original)',
            name: 'skipMode',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Enable skip mode: when terms match, set file to original and exit flow cleanly (useful for skip processing)',
        },
        {
            label: '🔄 Invert Match Logic',
            name: 'invertMatch',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Invert matching logic: Output 1 when terms do NOT match, Output 2 when terms DO match',
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
            tooltip: '✅ Continue processing - Terms found (or not found if inverted)',
        },
        {
            number: 2,
            tooltip: '⏭️ Skip processing - Terms not found (or found if inverted), or skip mode activated',
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

// Process path helper
const processPath = (includeFileDirectory, input) => {
    return includeFileDirectory 
        ? input 
        : `${(0, fileUtils_1.getFileName)(input)}.${(0, fileUtils_1.getContainer)(input)}`;
};

// Enhanced pattern matching with confidence scoring
const performPatternMatching = (searchString, terms, pattern, caseSensitive, logger) => {
    const result = {
        isMatch: false,
        matchedTerms: [],
        matchedPatterns: [],
        confidence: 0,
        analysisDetails: {
            termMatches: [],
            patternMatches: [],
            searchMethod: 'none'
        }
    };

    logger.debug(`Analyzing search string: "${searchString}"`);
    logger.debug(`Case sensitive: ${caseSensitive}`);

    // Prepare search string based on case sensitivity
    const searchTarget = caseSensitive ? searchString : searchString.toLowerCase();
    
    // Process terms
    if (terms && terms.trim()) {
        result.analysisDetails.searchMethod = 'terms';
        
        const searchTermsArray = terms.trim().split(',')
            .map(term => term.trim())
            .filter(term => term.length > 0)
            .map(term => {
                // Escape special regex characters for literal matching
                const escapedTerm = term.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
                return caseSensitive ? escapedTerm : escapedTerm.toLowerCase();
            });

        logger.extended(`Processing ${searchTermsArray.length} search terms`);
        
        searchTermsArray.forEach((escapedTerm, index) => {
            const originalTerm = terms.trim().split(',')[index].trim();
            const regex = new RegExp(escapedTerm);
            
            if (regex.test(searchTarget)) {
                result.matchedTerms.push(originalTerm);
                result.analysisDetails.termMatches.push({
                    term: originalTerm,
                    escapedTerm: escapedTerm,
                    position: searchTarget.search(regex),
                    confidence: 'high'
                });
                logger.debug(`✅ Term match: "${originalTerm}"`);
            } else {
                logger.debug(`❌ No match: "${originalTerm}"`);
            }
        });
    }

    // Process regex pattern
    if (pattern && pattern.trim()) {
        result.analysisDetails.searchMethod = result.analysisDetails.searchMethod === 'none' ? 'pattern' : 'combined';
        
        try {
            const flags = caseSensitive ? '' : 'i';
            const regex = new RegExp(pattern.trim(), flags);
            
            logger.extended(`Testing regex pattern: ${pattern} (flags: ${flags || 'none'})`);
            
            if (regex.test(searchString)) { // Always use original case for regex
                result.matchedPatterns.push(pattern.trim());
                result.analysisDetails.patternMatches.push({
                    pattern: pattern.trim(),
                    flags: flags,
                    confidence: 'high'
                });
                logger.success(`✅ Regex pattern match: "${pattern}"`);
            } else {
                logger.debug(`❌ Regex pattern no match: "${pattern}"`);
            }
        } catch (err) {
            logger.error(`Invalid regex pattern "${pattern}": ${err.message}`);
            result.analysisDetails.patternMatches.push({
                pattern: pattern.trim(),
                error: err.message,
                confidence: 'error'
            });
        }
    }

    // Calculate results
    result.isMatch = result.matchedTerms.length > 0 || result.matchedPatterns.length > 0;
    
    // Calculate confidence score
    const totalTerms = terms ? terms.trim().split(',').filter(t => t.trim()).length : 0;
    const totalPatterns = pattern && pattern.trim() ? 1 : 0;
    const totalCriteria = totalTerms + totalPatterns;
    
    if (totalCriteria > 0) {
        const matchedCriteria = result.matchedTerms.length + result.matchedPatterns.length;
        result.confidence = Math.round((matchedCriteria / totalCriteria) * 100);
    }

    logger.extended(`Match result: ${result.isMatch ? 'MATCH' : 'NO MATCH'} (confidence: ${result.confidence}%)`);
    
    return result;
};

// Quality assurance for pattern validation
const validatePatterns = (terms, pattern, logger) => {
    const result = {
        isValid: true,
        warnings: [],
        errors: []
    };

    // Validate terms
    if (terms && terms.trim()) {
        const termArray = terms.trim().split(',').map(t => t.trim()).filter(t => t.length > 0);
        
        if (termArray.length === 0) {
            result.warnings.push('Terms specified but all are empty after processing');
        }
        
        termArray.forEach((term, index) => {
            if (term.length > 100) {
                result.warnings.push(`Term ${index + 1} is very long (${term.length} chars) - may impact performance`);
            }
        });
        
        logger.debug(`Validated ${termArray.length} search terms`);
    }

    // Validate regex pattern
    if (pattern && pattern.trim()) {
        try {
            new RegExp(pattern.trim());
            logger.debug('Regex pattern validation passed');
        } catch (err) {
            result.isValid = false;
            result.errors.push(`Invalid regex pattern: ${err.message}`);
        }
    }

    // Check if any search criteria provided
    if ((!terms || !terms.trim()) && (!pattern || !pattern.trim())) {
        result.warnings.push('No search terms or patterns specified - will match nothing');
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
            validationTime: 0,
            patternMatchingTime: 0,
            totalTime: 0
        };

        // Extract inputs using destructuring
        const {
            fileToCheck,
            terms,
            caseSensitive,
            pattern,
            includeFileDirectory,
            skipMode,
            invertMatch,
            logging_level,
            showPerformanceMetrics
        } = args.inputs;

        logger.section('DeNiX Enhanced File Name Checker: Advanced Pattern Matching & Skip Processing');

        // ===============================================
        // STEP 1: INITIALIZATION AND INPUT VALIDATION
        // ===============================================
        
        logger.subsection('Step 1: Initialization and input validation');
        const initStartTime = Date.now();

        // Determine file path to check
        const filePathToCheck = fileToCheck === 'originalFile'
            ? processPath(includeFileDirectory, args.originalLibraryFile._id)
            : processPath(includeFileDirectory, args.inputFileObj._id);

        logger.info(`📁 Target file: ${fileToCheck === 'originalFile' ? 'Original Library File' : 'Working File'}`);
        logger.info(`🔍 Search path: ${filePathToCheck}`);
        logger.info(`📂 Include directory: ${includeFileDirectory ? 'Yes' : 'No'}`);

        // Configuration logging
        logger.extended(`🏷️ Search terms: ${terms || 'None'}`);
        logger.extended(`📝 Regex pattern: ${pattern || 'None'}`);
        logger.extended(`🔤 Case sensitive: ${caseSensitive ? 'Yes' : 'No'}`);
        logger.extended(`⏭️ Skip mode: ${skipMode ? 'Enabled' : 'Disabled'}`);
        logger.extended(`🔄 Invert logic: ${invertMatch ? 'Yes' : 'No'}`);
        logger.extended(`📊 Logging level: ${logging_level}`);

        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: PATTERN VALIDATION
        // ===============================================
        
        logger.subsection('Step 2: Pattern and term validation');
        const validationStartTime = Date.now();

        const validation = validatePatterns(terms, pattern, logger);
        
        if (!validation.isValid) {
            validation.errors.forEach(error => logger.error(error));
            throw new Error(`Pattern validation failed: ${validation.errors.join(', ')}`);
        }

        if (validation.warnings.length > 0) {
            validation.warnings.forEach(warning => logger.warn(warning));
        } else {
            logger.success('Pattern validation passed');
        }

        processingMetrics.validationTime = Date.now() - validationStartTime;

        // ===============================================
        // STEP 3: PATTERN MATCHING ANALYSIS
        // ===============================================
        
        logger.subsection('Step 3: Pattern matching analysis');
        const matchingStartTime = Date.now();

        const matchResult = performPatternMatching(
            filePathToCheck,
            terms,
            pattern,
            caseSensitive,
            logger
        );

        // Log matching results
        if (matchResult.isMatch) {
            logger.success(`Pattern match found (confidence: ${matchResult.confidence}%)`);
            
            if (matchResult.matchedTerms.length > 0) {
                logger.info(`🏷️ Matched terms: ${matchResult.matchedTerms.join(', ')}`);
            }
            
            if (matchResult.matchedPatterns.length > 0) {
                logger.info(`📝 Matched patterns: ${matchResult.matchedPatterns.join(', ')}`);
            }
        } else {
            logger.info('No pattern matches found');
        }

        // Detailed analysis for extended/debug logging
        if (['extended', 'debug'].includes(logging_level)) {
            logger.extended(`Search method: ${matchResult.analysisDetails.searchMethod}`);
            logger.extended(`Total term matches: ${matchResult.matchedTerms.length}`);
            logger.extended(`Total pattern matches: ${matchResult.matchedPatterns.length}`);
            
            if (logging_level === 'debug') {
                matchResult.analysisDetails.termMatches.forEach((match, index) => {
                    logger.debug(`Term ${index + 1}: "${match.term}" at position ${match.position}`);
                });
                
                matchResult.analysisDetails.patternMatches.forEach((match, index) => {
                    if (match.error) {
                        logger.debug(`Pattern ${index + 1}: Error - ${match.error}`);
                    } else {
                        logger.debug(`Pattern ${index + 1}: "${match.pattern}" (flags: ${match.flags || 'none'})`);
                    }
                });
            }
        }

        processingMetrics.patternMatchingTime = Date.now() - matchingStartTime;

        // ===============================================
        // STEP 4: DECISION LOGIC AND ROUTING
        // ===============================================
        
        logger.subsection('Step 4: Decision logic and output routing');

        // Apply invert logic if enabled
        let finalMatch = matchResult.isMatch;
        if (invertMatch) {
            finalMatch = !matchResult.isMatch;
            logger.info(`🔄 Invert logic applied: ${matchResult.isMatch ? 'match' : 'no match'} → ${finalMatch ? 'proceed' : 'skip'}`);
        }

        let outputNumber = finalMatch ? 1 : 2;
        let outputFileObj = args.inputFileObj;

        // Handle skip mode
        if (skipMode && matchResult.isMatch && !invertMatch) {
            logger.warn('⏭️ Skip mode activated - setting file to original');
            
            if (!args.originalLibraryFile || !args.originalLibraryFile._id) {
                logger.error('Missing original library file for skip mode');
                throw new Error('Skip mode requires valid original library file');
            }

            outputFileObj = { _id: args.originalLibraryFile._id };
            outputNumber = 2;
            logger.success(`File set to original: ${args.originalLibraryFile._id}`);
        }

        // Log final decision
        const action = outputNumber === 1 ? 'Continue processing' : 'Skip/Exit processing';
        const reason = skipMode && matchResult.isMatch ? 'Skip mode activated' : 
                      finalMatch ? 'Pattern match found' : 'No pattern match';
        
        logger.success(`Decision: ${action} (${reason})`);
        logger.info(`Routing to Output ${outputNumber}`);

        // ===============================================
        // STEP 5: FINAL PROCESSING AND RESULTS
        // ===============================================
        
        processingMetrics.totalTime = Date.now() - startTime;

        logger.subsection('Step 5: Processing summary and results');

        // Enhanced variables
        const updatedVariables = {
            ...args.variables,
            filename_check_performed: true,
            filename_check_matched: matchResult.isMatch,
            filename_check_confidence: matchResult.confidence,
            filename_check_matched_terms: matchResult.matchedTerms.join(','),
            filename_check_matched_patterns: matchResult.matchedPatterns.join(','),
            filename_check_inverted: invertMatch,
            filename_check_skip_mode: skipMode,
            filename_check_processing_time: processingMetrics.totalTime,
            filename_check_target_path: filePathToCheck
        };

        // Performance metrics
        if (showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Initialization: ${processingMetrics.initializationTime}ms`);
            logger.extended(`⏱️ Validation: ${processingMetrics.validationTime}ms`);
            logger.extended(`⏱️ Pattern matching: ${processingMetrics.patternMatchingTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            const efficiency = totalTime > 0 ? Math.round((1000 / totalTime) * 100) / 100 : 0;
            logger.extended(`📈 Processing efficiency: ${efficiency} checks/second`);

            // Add performance metrics to variables
            Object.assign(updatedVariables, {
                filename_check_processing_time_detailed: {
                    initialization: processingMetrics.initializationTime,
                    validation: processingMetrics.validationTime,
                    pattern_matching: processingMetrics.patternMatchingTime,
                    total: Math.round(totalTime)
                }
            });
        }

        // Feature utilization summary
        if (logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Search terms', enabled: !!(terms && terms.trim()) },
                { name: 'Regex patterns', enabled: !!(pattern && pattern.trim()) },
                { name: 'Case sensitivity', enabled: caseSensitive },
                { name: 'Directory inclusion', enabled: includeFileDirectory },
                { name: 'Skip mode', enabled: skipMode },
                { name: 'Invert logic', enabled: invertMatch },
                { name: 'Performance metrics', enabled: showPerformanceMetrics }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`🔍 Total criteria: ${(terms ? terms.split(',').length : 0) + (pattern ? 1 : 0)}`);
            logger.debug(`✅ Matched criteria: ${matchResult.matchedTerms.length + matchResult.matchedPatterns.length}`);
            logger.debug(`📋 Variables created: ${Object.keys(updatedVariables).length}`);
        }

        // Processing completion
        logger.success('File name checking completed successfully');
        logger.success('✅ Enhanced File Name Checker processing complete!');
        logger.info(`🎯 Final result: ${action}`);
        logger.info('=== End of Enhanced File Name Checking ===');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: outputFileObj,
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
        throw new Error(`Enhanced File Name Checker failed: ${error.message}`);
    }
});

exports.plugin = plugin;