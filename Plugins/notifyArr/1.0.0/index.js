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
    name: '📡 DeNiX Enhanced Multi-Instance Arr Notifier: Advanced Notification System',
    description: 'Advanced multi-instance notification system for Radarr, Sonarr, and Whisparr with intelligent matching, enhanced error handling, comprehensive logging, and performance monitoring. Features automatic failover and detailed diagnostics.',
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
        background: 'linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.15))',
    },
    tags: 'notification,radarr,sonarr,whisparr,automation,multi-instance,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '📡',
    inputs: [
        // === RADARR CONFIGURATION ===
        {
            label: '🎬 Radarr 1 - API Key',
            name: 'radarr1_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for first Radarr instance. Leave empty to skip this instance.',
        },
        {
            label: '🎬 Radarr 1 - Host',
            name: 'radarr1_host',
            type: 'string',
            defaultValue: 'http://192.168.1.1:7878',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for first Radarr instance (e.g., http://192.168.1.1:7878)',
        },
        {
            label: '🎬 Radarr 2 - API Key',
            name: 'radarr2_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for second Radarr instance. Leave empty to skip this instance.',
        },
        {
            label: '🎬 Radarr 2 - Host',
            name: 'radarr2_host',
            type: 'string',
            defaultValue: 'http://192.168.1.2:7878',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for second Radarr instance (e.g., http://192.168.1.2:7878)',
        },
        
        // === SONARR CONFIGURATION ===
        {
            label: '📺 Sonarr 1 - API Key',
            name: 'sonarr1_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for first Sonarr instance. Leave empty to skip this instance.',
        },
        {
            label: '📺 Sonarr 1 - Host',
            name: 'sonarr1_host',
            type: 'string',
            defaultValue: 'http://192.168.1.1:8989',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for first Sonarr instance (e.g., http://192.168.1.1:8989)',
        },
        {
            label: '📺 Sonarr 2 - API Key',
            name: 'sonarr2_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for second Sonarr instance. Leave empty to skip this instance.',
        },
        {
            label: '📺 Sonarr 2 - Host',
            name: 'sonarr2_host',
            type: 'string',
            defaultValue: 'http://192.168.1.2:8989',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for second Sonarr instance (e.g., http://192.168.1.2:8989)',
        },
        
        // === WHISPARR CONFIGURATION ===
        {
            label: '🔞 Whisparr 1 - API Key',
            name: 'whisparr1_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for first Whisparr instance. Leave empty to skip this instance.',
        },
        {
            label: '🔞 Whisparr 1 - Host',
            name: 'whisparr1_host',
            type: 'string',
            defaultValue: 'http://192.168.1.1:6969',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for first Whisparr instance (e.g., http://192.168.1.1:6969)',
        },
        {
            label: '🔞 Whisparr 2 - API Key',
            name: 'whisparr2_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for second Whisparr instance. Leave empty to skip this instance.',
        },
        {
            label: '🔞 Whisparr 2 - Host',
            name: 'whisparr2_host',
            type: 'string',
            defaultValue: 'http://192.168.1.2:6969',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for second Whisparr instance (e.g., http://192.168.1.2:6969)',
        },
        
        // === ADVANCED CONFIGURATION ===
        {
            label: '⏰ Request Timeout (seconds)',
            name: 'request_timeout',
            type: 'number',
            defaultValue: 15,
            inputUI: { type: 'text' },
            tooltip: 'Timeout for API requests to *arr instances. Increase for slow networks.',
        },
        {
            label: '🔄 Max Retry Attempts',
            name: 'max_retries',
            type: 'number',
            defaultValue: 2,
            inputUI: { type: 'text' },
            tooltip: 'Number of retry attempts for failed API requests. Set to 0 to disable retries.',
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
            tooltip: '✅ Successfully notified at least one instance',
        },
        {
            number: 2,
            tooltip: '⚠️ No instances found the file - check configuration or file naming',
        },
        {
            number: 3,
            tooltip: '❌ All configured instances failed - check API keys and connectivity',
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

    notification(message) {
        this.output.push(`📡 ${message}`);
    }

    network(message) {
        this.output.push(`🌐 ${message}`);
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

// Instance configuration builder
const buildInstances = (inputs, logger) => {
    const instances = [];
    const instanceConfigs = [
        { prefix: 'radarr1', type: 'radarr', icon: '🎬' },
        { prefix: 'radarr2', type: 'radarr', icon: '🎬' },
        { prefix: 'sonarr1', type: 'sonarr', icon: '📺' },
        { prefix: 'sonarr2', type: 'sonarr', icon: '📺' },
        { prefix: 'whisparr1', type: 'whisparr', icon: '🔞' },
        { prefix: 'whisparr2', type: 'whisparr', icon: '🔞' },
    ];

    instanceConfigs.forEach(config => {
        const apiKey = String(inputs[`${config.prefix}_api_key`] || '').trim();
        const host = String(inputs[`${config.prefix}_host`] || '').trim();

        if (apiKey && host) {
            const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host;
            const displayName = config.prefix.charAt(0).toUpperCase() + 
                              config.prefix.slice(1).replace(/(\d)/, ' $1');

            instances.push({
                name: displayName,
                type: config.type,
                icon: config.icon,
                host: cleanHost,
                apiKey: apiKey,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': apiKey,
                    'Accept': 'application/json',
                    'User-Agent': 'DeNiX-Enhanced-Arr-Notifier/3.0'
                }
            });

            logger.debug(`Configured ${displayName}: ${cleanHost} (API: ***${apiKey.slice(-4)})`);
        }
    });

    return instances;
};

// Enhanced IMDB ID extraction
const extractImdbId = (fileName) => {
    const patterns = [
        /\b(tt\d{7,10})\b/i,  // Standard IMDB format
        /imdb[:\-_]?(tt\d{7,10})/i,  // IMDB prefix
        /\[(tt\d{7,10})\]/i,  // Bracketed format
    ];

    for (const pattern of patterns) {
        const match = fileName.match(pattern);
        if (match) {
            return match[1] || match[0];
        }
    }

    return null;
};

// Quality assurance checks
const performQualityAssurance = (inputs, originalFileName, currentFileName, logger) => {
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
        // Check file names
        if (!originalFileName && !currentFileName) {
            result.canProcess = false;
            result.errorMessage = 'No file names provided for notification';
            return result;
        }

        // Check for valid file extensions
        const validExtensions = ['.mkv', '.mp4', '.avi', '.m4v', '.mov', '.wmv', '.flv', '.webm'];
        const hasValidExtension = validExtensions.some(ext => 
            (originalFileName && originalFileName.toLowerCase().endsWith(ext)) ||
            (currentFileName && currentFileName.toLowerCase().endsWith(ext))
        );

        if (!hasValidExtension) {
            result.warnings.push('File does not have a recognized video extension');
        }

        // Check timeout values
        if (inputs.request_timeout < 5 || inputs.request_timeout > 300) {
            result.warnings.push('Request timeout outside recommended range (5-300 seconds)');
        }

        if (inputs.max_retries < 0 || inputs.max_retries > 5) {
            result.warnings.push('Max retries outside recommended range (0-5)');
        }

        logger.success('Quality assurance validation completed');

    } catch (error) {
        result.warnings.push(`QA check encountered error: ${error.message}`);
    }

    return result;
};

// Enhanced API request with retry logic
const makeApiRequest = (method, url, data, headers, timeout, maxRetries, logger) => __awaiter(void 0, void 0, void 0, function* () {
    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                logger.extended(`Retry attempt ${attempt}/${maxRetries} for ${url}`);
                // Exponential backoff
                yield new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }

            const config = {
                method,
                url,
                headers,
                timeout: timeout * 1000
            };

            if (data) {
                config.data = data;
            }

            const axios = require('axios');
            const response = yield axios(config);
            
            if (attempt > 0) {
                logger.success(`Request succeeded on attempt ${attempt + 1}`);
            }
            
            return response;

        } catch (error) {
            lastError = error;
            
            if (attempt < maxRetries) {
                logger.warn(`Request failed (attempt ${attempt + 1}): ${error.message}`);
            } else {
                logger.error(`Request failed after ${maxRetries + 1} attempts: ${error.message}`);
            }

            // Don't retry on certain errors
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logger.error('Authentication error - not retrying');
                break;
            }
        }
    }

    throw lastError;
});

// Enhanced ID lookup function with fixed Radarr and Whisparr handling
const getId = (instance, fileName, inputs, logger) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.extended(`Looking up file in ${instance.name}...`);
        
        // Extract IMDB ID
        const imdbId = extractImdbId(fileName);
        if (imdbId) {
            logger.success(`IMDB ID found: ${imdbId}`);
            
            // Try IMDB lookup first
            try {
                const endpoint = instance.type === 'sonarr' ? 'series' : 'movie';
                const lookupUrl = `${instance.host}/api/v3/${endpoint}/lookup?term=imdb:${imdbId}`;
                
                logger.debug(`IMDB lookup URL: ${lookupUrl}`);
                
                const response = yield makeApiRequest(
                    'get',
                    lookupUrl,
                    null,
                    instance.headers,
                    inputs.request_timeout,
                    inputs.max_retries,
                    logger
                );

                const id = Number((response && response.data && response.data.at && response.data.at(0) && response.data.at(0).id) || -1);
                
                if (id !== -1) {
                    logger.success(`${instance.icon} ${instance.name} found ID ${id} for IMDB ${imdbId}`);
                    return id;
                } else {
                    logger.warn(`${instance.name} IMDB lookup returned no results`);
                }
            } catch (error) {
                logger.warn(`${instance.name} IMDB lookup failed: ${error.message}`);
            }
        } else {
            logger.warn('No IMDB ID found in filename');
        }

        // Fallback to filename parsing
        logger.extended(`Trying filename parse for ${instance.name}...`);
        
        const parseUrl = `${instance.host}/api/v3/parse?title=${encodeURIComponent((0, fileUtils_1.getFileName)(fileName))}`;
        logger.debug(`Parse URL: ${parseUrl}`);
        
        const parseResponse = yield makeApiRequest(
            'get',
            parseUrl,
            null,
            instance.headers,
            inputs.request_timeout,
            inputs.max_retries,
            logger
        );

        let id = -1;
        
        if (instance.type === 'sonarr') {
            // Keep existing Sonarr logic unchanged
            id = Number((parseResponse && parseResponse.data && parseResponse.data.series && parseResponse.data.series.id) || -1);
        } else {
            // Enhanced Radarr and Whisparr logic
            id = Number((parseResponse && parseResponse.data && parseResponse.data.movie && parseResponse.data.movie.id) || -1);
            
            // If no direct movie ID from parse, try enhanced search
            if (id === -1 && parseResponse && parseResponse.data) {
                const parsedTitle = parseResponse.data.title;
                const parsedYear = parseResponse.data.year;
                
                if (parsedTitle) {
                    logger.debug(`${instance.icon} Parsed movie title: "${parsedTitle}" year: ${parsedYear || 'unknown'}`);
                    
                    try {
                        // Get all movies from the library
                        const moviesUrl = `${instance.host}/api/v3/movie`;
                        logger.debug(`Getting all movies from: ${moviesUrl}`);
                        
                        const allMoviesResponse = yield makeApiRequest(
                            'get',
                            moviesUrl,
                            null,
                            instance.headers,
                            inputs.request_timeout,
                            inputs.max_retries,
                            logger
                        );
                        
                        const movies = allMoviesResponse.data || [];
                        logger.debug(`${instance.icon} Found ${movies.length} movies in ${instance.name} library`);
                        
                        // Find movie by title (and year if available)
                        let matchedMovie = null;
                        
                        // Try exact title match first
                        matchedMovie = movies.find(m => 
                            m.title && m.title.toLowerCase() === parsedTitle.toLowerCase()
                        );
                        
                        // If we have a year, prefer movies matching both title and year
                        if (parsedYear && matchedMovie) {
                            const yearMatch = movies.find(m => 
                                m.title && m.title.toLowerCase() === parsedTitle.toLowerCase() && 
                                m.year === parsedYear
                            );
                            if (yearMatch) {
                                matchedMovie = yearMatch;
                            }
                        }
                        
                        // Try fuzzy matching if no exact match
                        if (!matchedMovie) {
                            const cleanParsedTitle = parsedTitle.toLowerCase()
                                .replace(/[^\w\s]/g, ' ')
                                .replace(/\b(the|a|an)\b/g, '')
                                .replace(/\s+/g, ' ')
                                .trim();
                            
                            matchedMovie = movies.find(m => {
                                if (!m.title) return false;
                                
                                const cleanMovieTitle = m.title.toLowerCase()
                                    .replace(/[^\w\s]/g, ' ')
                                    .replace(/\b(the|a|an)\b/g, '')
                                    .replace(/\s+/g, ' ')
                                    .trim();
                                
                                return cleanMovieTitle === cleanParsedTitle;
                            });
                        }
                        
                        // Try file path matching if still no match
                        if (!matchedMovie) {
                            logger.debug(`${instance.icon} Trying file path matching for: ${fileName}`);
                            const fileDir = fileName.substring(0, fileName.lastIndexOf('/'));
                            
                            matchedMovie = movies.find(m => {
                                // Check if movie file path matches exactly
                                if (m.movieFile && m.movieFile.path === fileName) {
                                    logger.debug(`${instance.icon} Exact file path match: ${m.title}`);
                                    return true;
                                }
                                
                                // Check if file is in movie's directory
                                if (m.path && (fileName.startsWith(m.path) || fileDir === m.path)) {
                                    logger.debug(`${instance.icon} Directory path match: ${m.title} (${m.path})`);
                                    return true;
                                }
                                
                                // Check relative path matching
                                if (m.movieFile && m.movieFile.relativePath) {
                                    const fullMoviePath = `${m.path}/${m.movieFile.relativePath}`;
                                    if (fullMoviePath === fileName) {
                                        logger.debug(`${instance.icon} Relative path match: ${m.title}`);
                                        return true;
                                    }
                                }
                                
                                return false;
                            });
                        }
                        
                        if (matchedMovie) {
                            id = matchedMovie.id;
                            logger.success(`${instance.icon} Found movie '${matchedMovie.title}' (ID: ${id}) via enhanced search`);
                        } else {
                            logger.warn(`${instance.icon} No movie found for "${parsedTitle}" in library`);
                            
                            // Debug: show some available movies
                            if (movies.length > 0) {
                                const sampleMovies = movies.slice(0, 3).map(m => `"${m.title}" (${m.year || 'unknown'})`).join(', ');
                                logger.debug(`${instance.icon} Sample movies in library: ${sampleMovies}`);
                            }
                        }
                        
                    } catch (error) {
                        logger.error(`${instance.icon} Enhanced movie search failed: ${error.message}`);
                    }
                }
            }
        }

        if (id !== -1) {
            logger.success(`${instance.icon} ${instance.name} found ID ${id} via filename parse`);
        } else {
            logger.warn(`${instance.name} filename parse returned no results`);
        }

        return id;

    } catch (error) {
        logger.error(`Error during ${instance.name} lookup: ${error.message}`);
        if (error.response && error.response.status) {
            logger.error(`HTTP Status: ${error.response.status}`);
        }
        return -1;
    }
});

// Enhanced refresh command sender
const sendRefreshCommand = (instance, id, inputs, logger) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.notification(`Sending refresh command to ${instance.name}...`);

        const commandData = instance.type === 'sonarr' 
            ? { name: 'RefreshSeries', seriesId: id }
            : { name: 'RefreshMovie', movieIds: [id] };

        const commandUrl = `${instance.host}/api/v3/command`;
        
        logger.debug(`Command URL: ${commandUrl}`);
        logger.debug(`Command data: ${JSON.stringify(commandData)}`);

        const response = yield makeApiRequest(
            'post',
            commandUrl,
            commandData,
            instance.headers,
            inputs.request_timeout,
            inputs.max_retries,
            logger
        );

        logger.success(`🎉 Successfully notified ${instance.name}!`);
        logger.extended(`Response status: ${response.status}`);
        
        if (response.data && response.data.id) {
            logger.extended(`Command queued with ID: ${response.data.id}`);
        }

        return true;

    } catch (error) {
        logger.error(`Failed to notify ${instance.name}: ${error.message}`);
        if (error.response && error.response.status) {
            logger.error(`HTTP Status: ${error.response.status}`);
        }
        return false;
    }
});

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
            configurationTime: 0,
            qualityAssuranceTime: 0,
            notificationTime: 0,
            totalTime: 0
        };

        logger.section('DeNiX Enhanced Multi-Instance Arr Notifier: Advanced Notification System');
        
        // ===============================================
        // STEP 1: CONFIGURATION AND SETUP
        // ===============================================
        
        logger.subsection('Step 1: Configuration and setup');
        const configStartTime = Date.now();

        const originalFileName = (args.originalLibraryFile && args.originalLibraryFile._id) || '';
        const currentFileName = (args.inputFileObj && args.inputFileObj._id) || '';

        logger.info(`📁 Original file: ${originalFileName ? path.basename(originalFileName) : 'N/A'}`);
        logger.info(`📁 Current file: ${currentFileName ? path.basename(currentFileName) : 'N/A'}`);
        logger.info(`🔄 File changed: ${currentFileName !== originalFileName ? 'Yes' : 'No'}`);

        // Build instances configuration
        const instances = buildInstances(args.inputs, logger);
        
        if (instances.length === 0) {
            logger.error('No instances configured - please set API keys and hosts');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

        logger.success(`Successfully configured ${instances.length} instances:`);
        instances.forEach((instance, index) => {
            logger.extended(`  ${index + 1}. ${instance.icon} ${instance.name} (${instance.type}) - ${instance.host}`);
        });

        processingMetrics.configurationTime = Date.now() - configStartTime;

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        
        logger.subsection('Step 2: Quality assurance validation');
        const qaStartTime = Date.now();
        
        const validationResult = performQualityAssurance(
            args.inputs, 
            originalFileName, 
            currentFileName, 
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
        } else {
            logger.success('All quality assurance checks passed');
        }

        processingMetrics.qualityAssuranceTime = Date.now() - qaStartTime;

        // ===============================================
        // STEP 3: NOTIFICATION PROCESS
        // ===============================================
        
        logger.subsection('Step 3: Instance notification process');
        const notificationStartTime = Date.now();

        const stats = {
            totalInstances: instances.length,
            checkedInstances: 0,
            foundInstances: 0,
            notifiedInstances: 0,
            errors: []
        };

        // Process each instance until we find a successful notification
        for (let i = 0; i < instances.length; i++) {
            const instance = instances[i];
            stats.checkedInstances++;

            logger.extended(`\n${instance.icon} Checking ${instance.name} (${i + 1}/${instances.length})`);

            // Look up the file
            let id = yield getId(instance, originalFileName, args.inputs, logger);
            
            // If not found and we have a different current filename, try that
            if (id === -1 && currentFileName !== originalFileName && currentFileName) {
                logger.extended('Trying current filename as fallback...');
                id = yield getId(instance, currentFileName, args.inputs, logger);
            }

            if (id !== -1) {
                stats.foundInstances++;
                logger.success(`Found content with ID ${id} in ${instance.name}`);

                // Send refresh command
                const refreshSuccess = yield sendRefreshCommand(instance, id, args.inputs, logger);
                
                if (refreshSuccess) {
                    stats.notifiedInstances++;
                    logger.success(`🎉 Successfully notified ${instance.name}! Stopping here.`);
                    
                    processingMetrics.notificationTime = Date.now() - notificationStartTime;
                    processingMetrics.totalTime = Date.now() - startTime;

                    // Generate success summary
                    logger.subsection('Notification Summary');
                    logger.success(`Notification completed on first successful match`);
                    logger.info(`✅ Instances checked: ${stats.checkedInstances}/${stats.totalInstances}`);
                    logger.info(`🎯 Instances found file: ${stats.foundInstances}`);
                    logger.info(`📡 Successful notifications: ${stats.notifiedInstances}`);
                    logger.info(`📈 Success rate: ${((stats.notifiedInstances / stats.checkedInstances) * 100).toFixed(1)}%`);

                    // Performance metrics
                    if (args.inputs.showPerformanceMetrics && performanceTimer) {
                        const totalTime = performanceTimer.stop();
                        logger.extended(`⏱️ Configuration: ${processingMetrics.configurationTime}ms`);
                        logger.extended(`⏱️ Quality assurance: ${processingMetrics.qualityAssuranceTime}ms`);
                        logger.extended(`⏱️ Notifications: ${processingMetrics.notificationTime}ms`);
                        logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
                        
                        const efficiency = totalTime > 0 ? Math.round((1000 / totalTime) * 100) / 100 : 0;
                        logger.extended(`📈 Processing efficiency: ${efficiency} notifications/second`);
                    }

                    logger.success('✅ Enhanced Arr Notifier processing complete!');
                    args.jobLog(logger.getOutput());

                    return {
                        outputFileObj: args.inputFileObj,
                        outputNumber: 1,
                        variables: Object.assign(Object.assign({}, args.variables), {
                            arr_notification_result: 'success',
                            arr_notified_instance: instance.name,
                            arr_notification_time: processingMetrics.totalTime
                        }),
                    };
                } else {
                    stats.errors.push(`${instance.name}: Notification failed`);
                    logger.error(`Notification failed for ${instance.name}`);
                }
            } else {
                logger.warn(`${instance.name} does not know this file`);
            }
        }

        processingMetrics.notificationTime = Date.now() - notificationStartTime;
        processingMetrics.totalTime = Date.now() - startTime;

        // ===============================================
        // FINAL PROCESSING - NO SUCCESSFUL NOTIFICATIONS
        // ===============================================
        
        logger.section('No Successful Notifications');
        
        const finalResult = stats.foundInstances > 0 ? 'All notifications failed' : 'File not found in any instance';
        const outputNumber = stats.foundInstances > 0 ? 3 : 2;
        
        logger.error(finalResult);
        
        // Final summary
        logger.subsection('Final Summary');
        logger.info(`📊 Total instances configured: ${stats.totalInstances}`);
        logger.info(`🔍 Instances checked: ${stats.checkedInstances}`);
        logger.info(`🎯 Instances found file: ${stats.foundInstances}`);
        logger.info(`📡 Successful notifications: ${stats.notifiedInstances}`);
        logger.info(`❌ Errors encountered: ${stats.errors.length}`);

        if (stats.errors.length > 0) {
            logger.subsection('Error Details');
            stats.errors.forEach((error, index) => {
                logger.error(`${index + 1}. ${error}`);
            });
        }

        // Recommendations
        logger.subsection('Recommendations');
        if (stats.foundInstances === 0) {
            logger.info('💡 File not found in any instance:');
            logger.extended('  • Check if filename contains IMDB ID (tt1234567)');
            logger.extended('  • Verify file naming follows *arr naming conventions');
            logger.extended('  • Ensure the content exists in your *arr libraries');
            logger.extended('  • Check if file path matches *arr root folders');
            logger.extended('  • Verify content is monitored in *arr instances');
        } else {
            logger.info('💡 Notifications failed for found content:');
            logger.extended('  • Verify API keys are correct and have proper permissions');
            logger.extended('  • Check network connectivity to *arr instances');
            logger.extended('  • Verify *arr instances are running and accessible');
            logger.extended('  • Check *arr logs for additional error details');
            logger.extended('  • Consider increasing request timeout if network is slow');
        }

        // Performance metrics
        if (args.inputs.showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Configuration: ${processingMetrics.configurationTime}ms`);
            logger.extended(`⏱️ Quality assurance: ${processingMetrics.qualityAssuranceTime}ms`);
            logger.extended(`⏱️ Notifications: ${processingMetrics.notificationTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            const efficiency = totalTime > 0 ? Math.round((stats.checkedInstances / totalTime) * 1000) : 0;
            logger.extended(`📈 Processing efficiency: ${efficiency} instances/second`);
        }

        // Feature utilization summary
        if (args.inputs.logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Quality assurance', enabled: args.inputs.enable_qa_checks },
                { name: 'Performance metrics', enabled: args.inputs.showPerformanceMetrics },
                { name: 'Retry logic', enabled: args.inputs.max_retries > 0 },
                { name: 'Custom timeout', enabled: args.inputs.request_timeout !== 15 }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`🔧 Instances configured: ${stats.totalInstances}`);
            logger.debug(`🔍 Instances checked: ${stats.checkedInstances}`);
            logger.debug(`⏰ Request timeout: ${args.inputs.request_timeout}s`);
            logger.debug(`🔄 Max retries: ${args.inputs.max_retries}`);
        }

        logger.error('❌ Enhanced Arr Notifier completed with no successful notifications');
        logger.info('=== End of Enhanced Arr Notification Process ===');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
            outputNumber,
            variables: Object.assign(Object.assign({}, args.variables), {
                arr_notification_result: finalResult.toLowerCase().replace(/\s+/g, '_'),
                arr_instances_checked: stats.checkedInstances,
                arr_instances_found: stats.foundInstances,
                arr_notification_time: processingMetrics.totalTime
            }),
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