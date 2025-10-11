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
    name: '🎯 DeNiX Enhanced Universal Unmonitor: Advanced *ARR Integration',
    description: 'Comprehensive unmonitoring system for Radarr, Sonarr, and Whisparr with intelligent content detection, multi-instance support, and advanced logging. Features IMDB lookup, filename parsing, path matching, and automatic series management with enhanced error handling.',
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
        background: 'linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(255, 159, 28, 0.1))',
    },
    tags: 'radarr,sonarr,whisparr,unmonitor,arr,automation,enhanced',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🎯',
    inputs: [
        // Radarr Instance 1
        {
            label: '🎬 Radarr 1 API Key',
            name: 'radarr1_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for first Radarr instance. Leave blank to disable this instance.',
        },
        {
            label: '🎬 Radarr 1 Host',
            name: 'radarr1_host',
            type: 'string',
            defaultValue: 'http://192.168.1.1:7878',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for first Radarr instance. Example: http://192.168.1.1:7878',
        },
        
        // Radarr Instance 2
        {
            label: '🎬 Radarr 2 API Key',
            name: 'radarr2_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for second Radarr instance. Leave blank to disable this instance.',
        },
        {
            label: '🎬 Radarr 2 Host',
            name: 'radarr2_host',
            type: 'string',
            defaultValue: 'http://192.168.1.2:7878',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for second Radarr instance. Example: http://192.168.1.2:7878',
        },
        
        // Sonarr Instance 1
        {
            label: '📺 Sonarr 1 API Key',
            name: 'sonarr1_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for first Sonarr instance. Leave blank to disable this instance.',
        },
        {
            label: '📺 Sonarr 1 Host',
            name: 'sonarr1_host',
            type: 'string',
            defaultValue: 'http://192.168.1.1:8989',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for first Sonarr instance. Example: http://192.168.1.1:8989',
        },
        {
            label: '📺 Sonarr 1 - Unmonitor Series',
            name: 'sonarr1_unmonitor_series',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Automatically unmonitor series when no monitored episodes with files remain',
        },
        
        // Sonarr Instance 2
        {
            label: '📺 Sonarr 2 API Key',
            name: 'sonarr2_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for second Sonarr instance. Leave blank to disable this instance.',
        },
        {
            label: '📺 Sonarr 2 Host',
            name: 'sonarr2_host',
            type: 'string',
            defaultValue: 'http://192.168.1.2:8989',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for second Sonarr instance. Example: http://192.168.1.2:8989',
        },
        {
            label: '📺 Sonarr 2 - Unmonitor Series',
            name: 'sonarr2_unmonitor_series',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Automatically unmonitor series when no monitored episodes with files remain',
        },

        // Whisparr Instance 1
        {
            label: '🔞 Whisparr 1 API Key',
            name: 'whisparr1_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for first Whisparr instance. Leave blank to disable this instance.',
        },
        {
            label: '🔞 Whisparr 1 Host',
            name: 'whisparr1_host',
            type: 'string',
            defaultValue: 'http://192.168.1.1:6969',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for first Whisparr instance. Example: http://192.168.1.1:6969',
        },
        
        // Whisparr Instance 2
        {
            label: '🔞 Whisparr 2 API Key',
            name: 'whisparr2_api_key',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'API key for second Whisparr instance. Leave blank to disable this instance.',
        },
        {
            label: '🔞 Whisparr 2 Host',
            name: 'whisparr2_host',
            type: 'string',
            defaultValue: 'http://192.168.1.2:6969',
            inputUI: { type: 'text' },
            tooltip: 'Host URL for second Whisparr instance. Example: http://192.168.1.2:6969',
        },

        // Enhanced Configuration Options
        {
            label: '🛑 Stop On First Success',
            name: 'stop_on_success',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Stop processing additional instances once one successfully unmonitors the content',
        },
        {
            label: '🔄 Retry With Current Filename',
            name: 'retry_with_current',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'If lookup fails with original filename, retry with current processed filename',
        },
        {
            label: '⏰ API Timeout (seconds)',
            name: 'api_timeout',
            type: 'number',
            defaultValue: 30,
            inputUI: { type: 'text' },
            tooltip: 'Timeout for API requests in seconds. Default: 30 seconds',
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
        {
            label: '📋 Generate Detailed Report',
            name: 'generateReport',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Generate comprehensive unmonitoring report with service analysis',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: '✅ Success - At least one item was successfully unmonitored',
        },
        {
            number: 2,
            tooltip: '⚠️ No Changes - No items found or all were already unmonitored',
        },
        {
            number: 3,
            tooltip: '❌ Error - Failed to process or no services configured',
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

    api(message) {
        this.output.push(`🌐 ${message}`);
    }

    search(message) {
        this.output.push(`🔍 ${message}`);
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

// Service type definitions
const ServiceType = {
    RADARR: { name: 'Radarr', icon: '🎬', endpoint: 'movie' },
    SONARR: { name: 'Sonarr', icon: '📺', endpoint: 'series' },
    WHISPARR: { name: 'Whisparr', icon: '🔞', endpoint: 'movie' }
};

// Enhanced IMDB ID extraction
const extractImdbId = (fileName) => {
    const patterns = [
        /\b(tt\d{7,10})\b/i,
        /\bimdb[_-]?(tt\d{7,10})\b/i,
        /\[(tt\d{7,10})\]/i
    ];
    
    for (const pattern of patterns) {
        const match = pattern.exec(fileName);
        if (match) {
            return match[1] || match[0];
        }
    }
    return '';
};

// Format time duration
const formatDuration = (milliseconds) => {
    if (milliseconds < 1000) return `${milliseconds.toFixed(0)}ms`;
    const seconds = (milliseconds / 1000).toFixed(2);
    return `${seconds}s`;
};

// Quality assurance validation
const performQualityAssurance = (inputs, logger) => {
    const result = {
        canProcess: true,
        errorMessage: '',
        warnings: [],
        enabledServices: 0
    };

    if (!inputs.enable_qa_checks) {
        logger.debug('Quality assurance checks disabled');
        return result;
    }

    try {
        // Count enabled services
        const serviceConfigs = [
            { api: inputs.radarr1_api_key, host: inputs.radarr1_host, name: 'Radarr 1' },
            { api: inputs.radarr2_api_key, host: inputs.radarr2_host, name: 'Radarr 2' },
            { api: inputs.sonarr1_api_key, host: inputs.sonarr1_host, name: 'Sonarr 1' },
            { api: inputs.sonarr2_api_key, host: inputs.sonarr2_host, name: 'Sonarr 2' },
            { api: inputs.whisparr1_api_key, host: inputs.whisparr1_host, name: 'Whisparr 1' },
            { api: inputs.whisparr2_api_key, host: inputs.whisparr2_host, name: 'Whisparr 2' }
        ];

        for (const config of serviceConfigs) {
            if (config.api && config.api.trim() !== '') {
                result.enabledServices++;
                
                // Validate host format
                if (!config.host.startsWith('http://') && !config.host.startsWith('https://')) {
                    result.warnings.push(`${config.name} host should start with http:// or https://`);
                }
                
                // Check for default values that might need updating
                if (config.host.includes('192.168.1.')) {
                    result.warnings.push(`${config.name} is using default IP address - verify this is correct`);
                }
            }
        }

        if (result.enabledServices === 0) {
            result.canProcess = false;
            result.errorMessage = 'No services configured - at least one API key is required';
            return result;
        }

        // Validate timeout
        const timeout = Number(inputs.api_timeout);
        if (isNaN(timeout) || timeout <= 0 || timeout > 300) {
            result.warnings.push('API timeout should be between 1-300 seconds');
        }

        logger.success(`Quality assurance validation completed - ${result.enabledServices} service(s) enabled`);

    } catch (error) {
        result.warnings.push(`QA check encountered error: ${error.message}`);
    }

    return result;
};

// Enhanced movie/scene lookup - FIXED FOR RADARR AND WHISPARR
const getMovieInfo = (args, serviceType, host, headers, fileName, logger) => __awaiter(void 0, void 0, void 0, function* () {
    logger.search(`${serviceType.icon} Searching for content using file: ${(0, fileUtils_1.getFileName)(fileName)}`);
    
    const imdbId = extractImdbId(fileName);
    let id = -1;
    let movie = null;
    const methods = [];
    
    // Method 1: IMDB lookup
    if (imdbId !== '') {
        logger.debug(`Found IMDB ID: ${imdbId}`);
        try {
            logger.api(`Looking up IMDB: ${imdbId}`);
            const lookupResponse = yield args.deps.axios({
                method: 'get',
                url: `${host}/api/v3/${serviceType.endpoint}/lookup?term=imdb:${imdbId}`,
                headers,
                timeout: Number(args.inputs.api_timeout) * 1000,
            });
            
            movie = lookupResponse.data?.at(0) ?? null;
            id = movie?.id ?? -1;
            
            if (id !== -1) {
                methods.push('IMDB lookup');
                logger.success(`${serviceType.icon} Found '${movie.title}' (ID: ${id}) via IMDB lookup`);
            } else {
                logger.warn(`${serviceType.icon} No content found for IMDB: ${imdbId}`);
            }
        } catch (error) {
            logger.error(`${serviceType.icon} IMDB lookup failed: ${error.message}`);
        }
    }

    // Method 2: Filename parsing - ENHANCED VERSION
    if (id === -1) {
        logger.debug('Attempting filename parsing');
        try {
            const parseResponse = yield args.deps.axios({
                method: 'get',
                url: `${host}/api/v3/parse?title=${encodeURIComponent((0, fileUtils_1.getFileName)(fileName))}`,
                headers,
                timeout: Number(args.inputs.api_timeout) * 1000,
            });
            
            // Try to get direct movie ID first
            id = parseResponse?.data?.movie?.id ?? -1;
            
            if (id !== -1) {
                // Get the full movie object if we have an ID
                const movieResponse = yield args.deps.axios({
                    method: 'get',
                    url: `${host}/api/v3/${serviceType.endpoint}/${id}`,
                    headers,
                    timeout: Number(args.inputs.api_timeout) * 1000,
                });
                movie = movieResponse.data;
                methods.push('filename parsing');
            } else {
                // Enhanced search if no direct ID from parse
                const parsedTitle = parseResponse?.data?.title;
                const parsedYear = parseResponse?.data?.year;
                
                if (parsedTitle) {
                    logger.debug(`${serviceType.icon} Parsed title: "${parsedTitle}" year: ${parsedYear || 'unknown'}`);
                    
                    try {
                        // Get all movies from the library
                        const allMoviesResponse = yield args.deps.axios({
                            method: 'get',
                            url: `${host}/api/v3/${serviceType.endpoint}`,
                            headers,
                            timeout: Number(args.inputs.api_timeout) * 1000,
                        });
                        
                        const movies = allMoviesResponse.data || [];
                        logger.debug(`${serviceType.icon} Found ${movies.length} movies in library`);
                        
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
                        
                        if (matchedMovie) {
                            movie = matchedMovie;
                            id = matchedMovie.id;
                            methods.push('filename parsing + library search');
                            logger.success(`${serviceType.icon} Found '${movie.title}' (ID: ${id}) via enhanced search`);
                        }
                        
                    } catch (error) {
                        logger.error(`${serviceType.icon} Enhanced movie search failed: ${error.message}`);
                    }
                }
            }
            
            const movieTitle = movie?.title ?? 'Unknown';
            const statusMessage = id !== -1 ? `'${movieTitle}' (ID: ${id})` : 'No content found';
            logger[id !== -1 ? 'success' : 'warn'](`${serviceType.icon} ${statusMessage} via filename parsing`);
        } catch (error) {
            logger.error(`${serviceType.icon} Filename parsing failed: ${error.message}`);
        }
    }

    // Method 3: File path matching - ENHANCED VERSION
    if (id === -1) {
        logger.debug('Attempting file path matching');
        try {
            const allMoviesResponse = yield args.deps.axios({
                method: 'get',
                url: `${host}/api/v3/${serviceType.endpoint}`,
                headers,
                timeout: Number(args.inputs.api_timeout) * 1000,
            });
            
            const movies = allMoviesResponse.data || [];
            const fileDir = fileName.substring(0, fileName.lastIndexOf('/'));
            
            movie = movies.find(m => {
                // Check if movie file path matches exactly
                if (m.movieFile?.path === fileName) {
                    logger.debug(`${serviceType.icon} Exact file path match: ${m.title}`);
                    return true;
                }
                
                // Check if file is in movie's directory
                if (m.path && (fileName.startsWith(m.path) || fileDir === m.path)) {
                    logger.debug(`${serviceType.icon} Directory path match: ${m.title} (${m.path})`);
                    return true;
                }
                
                // Check relative path matching
                if (m.movieFile && m.movieFile.relativePath) {
                    const fullMoviePath = `${m.path}/${m.movieFile.relativePath}`;
                    if (fullMoviePath === fileName) {
                        logger.debug(`${serviceType.icon} Relative path match: ${m.title}`);
                        return true;
                    }
                }
                
                return false;
            });
            
            if (movie) {
                id = movie.id;
                methods.push('file path matching');
                logger.success(`${serviceType.icon} Found '${movie.title}' (ID: ${id}) via file path matching`);
            } else {
                logger.warn(`${serviceType.icon} No content found via file path matching`);
                
                // Debug info: show some available movies for troubleshooting
                if (movies.length > 0) {
                    logger.debug(`${serviceType.icon} Available movies in library: ${movies.length}`);
                    const sampleMovies = movies.slice(0, 3).map(m => `"${m.title}" (${m.path})`).join(', ');
                    logger.debug(`${serviceType.icon} Sample movies: ${sampleMovies}`);
                    logger.debug(`${serviceType.icon} Looking for file: ${fileName}`);
                    logger.debug(`${serviceType.icon} File directory: ${fileDir}`);
                }
            }
        } catch (error) {
            logger.error(`${serviceType.icon} File path matching failed: ${error.message}`);
        }
    }

    return { id, item: movie, methods };
});

// Enhanced episode lookup - FIXED FOR SONARR
const getEpisodeInfo = (args, host, headers, fileName, logger) => __awaiter(void 0, void 0, void 0, function* () {
    logger.search(`📺 Searching for episode using file: ${(0, fileUtils_1.getFileName)(fileName)}`);
    
    const info = { seriesId: -1, seasonNumber: -1, episodeNumber: -1, methods: [] };
    const imdbId = extractImdbId(fileName);
    
    // Method 1: IMDB lookup
    if (imdbId !== '') {
        logger.debug(`Found IMDB ID: ${imdbId}`);
        try {
            logger.api(`Looking up IMDB: ${imdbId}`);
            const lookupResponse = yield args.deps.axios({
                method: 'get',
                url: `${host}/api/v3/series/lookup?term=imdb:${imdbId}`,
                headers,
                timeout: Number(args.inputs.api_timeout) * 1000,
            });
            
            const series = lookupResponse.data?.at(0) ?? null;
            if (series) {
                info.seriesId = series.id;
                info.series = series;
                info.methods.push('IMDB lookup');
                
                const seasonEpisodeMatch = /\bS(\d{1,3})E(\d{1,4})\b/i.exec(fileName);
                if (seasonEpisodeMatch) {
                    info.seasonNumber = parseInt(seasonEpisodeMatch[1], 10);
                    info.episodeNumber = parseInt(seasonEpisodeMatch[2], 10);
                }
                logger.success(`📺 Found series '${series.title}' (ID: ${series.id}) via IMDB lookup`);
            } else {
                logger.warn(`📺 No series found for IMDB: ${imdbId}`);
            }
        } catch (error) {
            logger.error(`📺 IMDB lookup failed: ${error.message}`);
        }
    }

    // Method 2: Filename parsing
    if (info.seriesId === -1 || info.seasonNumber === -1 || info.episodeNumber === -1) {
        logger.debug('Attempting filename parsing');
        try {
            const parseResponse = yield args.deps.axios({
                method: 'get',
                url: `${host}/api/v3/parse?title=${encodeURIComponent((0, fileUtils_1.getFileName)(fileName))}`,
                headers,
                timeout: Number(args.inputs.api_timeout) * 1000,
            });
            
            if (parseResponse?.data?.series?.id) {
                info.seriesId = parseResponse.data.series.id;
                info.seasonNumber = parseResponse.data.parsedEpisodeInfo?.seasonNumber ?? 1;
                info.episodeNumber = parseResponse.data.parsedEpisodeInfo?.episodeNumbers?.at(0) ?? 1;
                
                const seriesResponse = yield args.deps.axios({
                    method: 'get',
                    url: `${host}/api/v3/series/${info.seriesId}`,
                    headers,
                    timeout: Number(args.inputs.api_timeout) * 1000,
                });
                info.series = seriesResponse.data;
                info.methods.push('filename parsing');
                
                const seriesTitle = info.series?.title ?? 'Unknown';
                const episodeRef = `S${info.seasonNumber}E${info.episodeNumber}`;
                logger.success(`📺 Found series '${seriesTitle}' - ${episodeRef} via filename parsing`);
            }
        } catch (error) {
            logger.error(`📺 Filename parsing failed: ${error.message}`);
        }
    }

    // ENHANCED: Actually fetch the episode object if we have series info
    if (info.seriesId !== -1 && info.seasonNumber !== -1 && info.episodeNumber !== -1) {
        logger.debug(`📺 Fetching episode object for S${info.seasonNumber}E${info.episodeNumber}`);
        try {
            const episodesResponse = yield args.deps.axios({
                method: 'get',
                url: `${host}/api/v3/episode?seriesId=${info.seriesId}`,
                headers,
                timeout: Number(args.inputs.api_timeout) * 1000,
            });
            
            const episodes = episodesResponse.data || [];
            
            // Find the specific episode
            const episode = episodes.find(e => 
                e.seasonNumber === info.seasonNumber && 
                e.episodeNumber === info.episodeNumber
            );
            
            if (episode) {
                info.episode = episode;
                logger.success(`📺 Found episode object: ${episode.title || 'Untitled'} (ID: ${episode.id})`);
                logger.debug(`📺 Episode monitored: ${episode.monitored}, hasFile: ${episode.hasFile}`);
            } else {
                logger.warn(`📺 Episode S${info.seasonNumber}E${info.episodeNumber} not found in series episodes`);
                // Log available episodes for debugging
                if (episodes.length > 0) {
                    const availableEpisodes = episodes
                        .filter(e => e.seasonNumber === info.seasonNumber)
                        .map(e => `E${e.episodeNumber}`)
                        .slice(0, 10) // Limit to first 10 for readability
                        .join(', ');
                    logger.debug(`📺 Available episodes in season ${info.seasonNumber}: ${availableEpisodes}`);
                }
            }
        } catch (error) {
            logger.error(`📺 Failed to fetch episode object: ${error.message}`);
        }
    }

    // Method 3: File path matching (keep existing logic)
    if (!info.episode && info.seriesId === -1) {
        logger.debug('Attempting file path matching');
        try {
            const allSeriesResponse = yield args.deps.axios({
                method: 'get',
                url: `${host}/api/v3/series`,
                headers,
                timeout: Number(args.inputs.api_timeout) * 1000,
            });
            
            const allSeries = allSeriesResponse.data || [];
            const fileDir = fileName.substring(0, fileName.lastIndexOf('/'));
            
            const series = allSeries.find(s => {
                if (!s.path) return false;
                return fileName.startsWith(s.path) || fileDir.startsWith(s.path);
            });
            
            if (series) {
                info.seriesId = series.id;
                info.series = series;
                info.methods.push('file path matching');
                
                const episodesResponse = yield args.deps.axios({
                    method: 'get',
                    url: `${host}/api/v3/episode?seriesId=${series.id}`,
                    headers,
                    timeout: Number(args.inputs.api_timeout) * 1000,
                });
                
                const episodes = episodesResponse.data || [];
                const episode = episodes.find(e => e.hasFile && e.episodeFile?.path === fileName);
                
                if (episode) {
                    info.episode = episode;
                    info.seasonNumber = episode.seasonNumber;
                    info.episodeNumber = episode.episodeNumber;
                    const episodeRef = `S${episode.seasonNumber}E${episode.episodeNumber}`;
                    logger.success(`📺 Found episode: ${series.title} - ${episodeRef} - ${episode.title}`);
                } else {
                    logger.warn('📺 Series found but no matching episode file');
                }
            }
        } catch (error) {
            logger.error(`📺 File path matching failed: ${error.message}`);
        }
    }

    return info;
});

// Enhanced movie unmonitoring
const unmonitorMovie = (args, serviceType, instanceNum, host, headers, fileName, logger) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(`${serviceType.icon} Instance ${instanceNum} - Starting unmonitor process`);
    
    const movieData = yield getMovieInfo(args, serviceType, host, headers, fileName, logger);
    
    if (movieData.id === -1 || !movieData.item) {
        logger.warn(`${serviceType.icon} Instance ${instanceNum} - Content not found`);
        return { success: false, reason: 'Content not found', methods: movieData.methods };
    }
    
    if (!movieData.item.monitored) {
        logger.info(`${serviceType.icon} Instance ${instanceNum} - '${movieData.item.title}' is already unmonitored`);
        return { success: true, reason: 'Already unmonitored', methods: movieData.methods };
    }
    
    try {
        const updatedMovie = Object.assign(Object.assign({}, movieData.item), { monitored: false });
        const contentType = serviceType === ServiceType.RADARR ? 'movie' : 'scene';
        
        logger.api(`${serviceType.icon} Instance ${instanceNum} - Sending unmonitor request for '${movieData.item.title}'`);
        yield args.deps.axios({
            method: 'put',
            url: `${host}/api/v3/${serviceType.endpoint}/${movieData.id}`,
            headers,
            data: updatedMovie,
            timeout: Number(args.inputs.api_timeout) * 1000,
        });
        
        logger.success(`${serviceType.icon} Instance ${instanceNum} - ${contentType} '${movieData.item.title}' (ID: ${movieData.id}) successfully unmonitored`);
        return { success: true, reason: 'Successfully unmonitored', methods: movieData.methods, title: movieData.item.title, id: movieData.id };
    } catch (error) {
        logger.error(`${serviceType.icon} Instance ${instanceNum} - Failed to unmonitor: ${error.message}`);
        return { success: false, reason: `Unmonitor failed: ${error.message}`, methods: movieData.methods };
    }
});

// Enhanced episode unmonitoring
const unmonitorEpisode = (args, instanceNum, host, headers, fileName, unmonitorSeries, logger) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(`📺 Instance ${instanceNum} - Starting episode unmonitor process`);
    
    const episodeInfo = yield getEpisodeInfo(args, host, headers, fileName, logger);
    
    if (!episodeInfo.episode) {
        logger.warn(`📺 Instance ${instanceNum} - Episode not found`);
        return { success: false, reason: 'Episode not found', methods: episodeInfo.methods };
    }
    
    if (!episodeInfo.episode.monitored) {
        logger.info(`📺 Instance ${instanceNum} - Episode is already unmonitored`);
        return { success: true, reason: 'Already unmonitored', methods: episodeInfo.methods };
    }
    
    try {
        const updatedEpisode = Object.assign(Object.assign({}, episodeInfo.episode), { monitored: false });
        
        logger.api(`📺 Instance ${instanceNum} - Sending unmonitor request for episode`);
        yield args.deps.axios({
            method: 'put',
            url: `${host}/api/v3/episode/${episodeInfo.episode.id}`,
            headers,
            data: updatedEpisode,
            timeout: Number(args.inputs.api_timeout) * 1000,
        });
        
        const episodeTitle = episodeInfo.episode.title;
        const episodeRef = `S${episodeInfo.seasonNumber}E${episodeInfo.episodeNumber}`;
        logger.success(`📺 Instance ${instanceNum} - Episode '${episodeTitle}' (${episodeRef}) successfully unmonitored`);
        
        let seriesUnmonitored = false;
        
        // Check if we should also unmonitor the series
        if (unmonitorSeries && episodeInfo.series) {
            logger.debug(`📺 Instance ${instanceNum} - Checking if series should be unmonitored`);
            try {
                const allEpisodesResponse = yield args.deps.axios({
                    method: 'get',
                    url: `${host}/api/v3/episode?seriesId=${episodeInfo.seriesId}`,
                    headers,
                    timeout: Number(args.inputs.api_timeout) * 1000,
                });
                
                const allEpisodes = allEpisodesResponse.data || [];
                const currentEpisodeId = episodeInfo.episode?.id;
                
                // Filter out current episode and check for remaining monitored episodes with files
                const filteredEpisodes = allEpisodes.filter(e => {
                    const isDifferentEpisode = e.id !== currentEpisodeId;
                    return isDifferentEpisode && e.monitored && e.hasFile;
                });
                
                const remainingMonitored = filteredEpisodes.length;
                logger.debug(`📺 Instance ${instanceNum} - Found ${remainingMonitored} remaining monitored episodes with files`);
                
                if (remainingMonitored === 0 && episodeInfo.series.monitored) {
                    const updatedSeries = Object.assign(Object.assign({}, episodeInfo.series), { monitored: false });
                    
                    logger.api(`📺 Instance ${instanceNum} - Unmonitoring series (no monitored episodes remain)`);
                    yield args.deps.axios({
                        method: 'put',
                        url: `${host}/api/v3/series/${episodeInfo.seriesId}`,
                        headers,
                        data: updatedSeries,
                        timeout: Number(args.inputs.api_timeout) * 1000,
                    });
                    
                    const seriesTitle = episodeInfo.series.title;
                    const message = `Series '${seriesTitle}' also unmonitored (no monitored episodes with files remain)`;
                    logger.success(`📺 Instance ${instanceNum} - ${message}`);
                    seriesUnmonitored = true;
                }
            } catch (error) {
                logger.warn(`📺 Instance ${instanceNum} - Could not check/unmonitor series: ${error.message}`);
            }
        }
        
        return { 
            success: true, 
            reason: 'Successfully unmonitored', 
            methods: episodeInfo.methods,
            episodeTitle,
            episodeRef,
            seriesUnmonitored,
            seriesTitle: episodeInfo.series?.title
        };
    } catch (error) {
        logger.error(`📺 Instance ${instanceNum} - Failed to unmonitor episode: ${error.message}`);
        return { success: false, reason: `Unmonitor failed: ${error.message}`, methods: episodeInfo.methods };
    }
});

// Generate comprehensive processing report
const generateProcessingReport = (results, processingMetrics, inputs) => {
    const report = [];
    
    report.push('📋 Universal Unmonitor Processing Report');
    report.push('═'.repeat(40));
    report.push(`Processing Time: ${formatDuration(processingMetrics.totalTime)}`);
    report.push(`Services Processed: ${results.length}`);
    report.push('');
    
    // Success summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    report.push('📊 Summary:');
    report.push(`• Successful: ${successful.length}`);
    report.push(`• Failed: ${failed.length}`);
    report.push(`• Stop on Success: ${inputs.stop_on_success ? 'Enabled' : 'Disabled'}`);
    report.push('');
    
    // Detailed results
    if (successful.length > 0) {
        report.push('✅ Successful Operations:');
        successful.forEach((result, index) => {
            const serviceInfo = `${result.serviceType.icon} ${result.serviceType.name} ${result.instance}`;
            report.push(`${index + 1}. ${serviceInfo}: ${result.reason}`);
            if (result.title) {
                report.push(`   Content: ${result.title} (ID: ${result.id || 'N/A'})`);
            }
            if (result.methods && result.methods.length > 0) {
                report.push(`   Detection: ${result.methods.join(', ')}`);
            }
            if (result.seriesUnmonitored) {
                report.push(`   Series: ${result.seriesTitle} also unmonitored`);
            }
        });
        report.push('');
    }
    
    if (failed.length > 0) {
        report.push('❌ Failed Operations:');
        failed.forEach((result, index) => {
            const serviceInfo = `${result.serviceType.icon} ${result.serviceType.name} ${result.instance}`;
            report.push(`${index + 1}. ${serviceInfo}: ${result.reason}`);
            if (result.methods && result.methods.length > 0) {
                report.push(`   Attempted: ${result.methods.join(', ')}`);
            }
        });
        report.push('');
    }
    
    // Performance metrics
    if (processingMetrics.apiCalls > 0) {
        report.push('⚡ Performance Metrics:');
        report.push(`• Total API Calls: ${processingMetrics.apiCalls}`);
        report.push(`• Average API Response: ${formatDuration(processingMetrics.totalApiTime / processingMetrics.apiCalls)}`);
        report.push(`• Processing Efficiency: ${(processingMetrics.apiCalls / (processingMetrics.totalTime / 1000)).toFixed(2)} calls/second`);
    }
    
    return report.join('\n');
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
            serviceProcessingTime: 0,
            reportGenerationTime: 0,
            totalTime: 0,
            apiCalls: 0,
            totalApiTime: 0
        };

        logger.banner('🎯 ENHANCED UNIVERSAL UNMONITOR v3.0 STARTING');
        logger.section('DeNiX Enhanced Universal Unmonitor: Advanced *ARR Integration');

        // ===============================================
        // STEP 1: INITIALIZATION AND FILE ANALYSIS
        // ===============================================
        
        logger.subsection('Step 1: Initialization and file analysis');
        const initStartTime = Date.now();
        
        const originalFileName = args.originalLibraryFile?._id ?? '';
        const currentFileName = args.inputFileObj?._id ?? '';
        const targetFileName = currentFileName || originalFileName;
        
        if (!targetFileName) {
            logger.error('No file path available for processing');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }
        
        logger.info(`📁 Processing file: ${(0, fileUtils_1.getFileName)(targetFileName)}`);
        logger.extended(`Original file: ${originalFileName || 'N/A'}`);
        logger.extended(`Current file: ${currentFileName || 'N/A'}`);
        
        const {
            stop_on_success,
            retry_with_current,
            api_timeout,
            enable_qa_checks,
            logging_level,
            showPerformanceMetrics,
            generateReport
        } = args.inputs;

        logger.extended(`Stop on success: ${stop_on_success}`);
        logger.extended(`Retry with current filename: ${retry_with_current}`);
        logger.extended(`API timeout: ${api_timeout} seconds`);

        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        
        logger.subsection('Step 2: Quality assurance and service validation');
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
        // STEP 3: SERVICE CONFIGURATION
        // ===============================================
        
        logger.subsection('Step 3: Building service configuration');
        
        const enabledServices = [];
        
        // Build list of enabled services
        const serviceConfigs = [
            {
                condition: args.inputs.radarr1_api_key?.trim(),
                type: ServiceType.RADARR,
                instance: 1,
                host: args.inputs.radarr1_host?.trim().replace(/\/$/, ''),
                apiKey: args.inputs.radarr1_api_key?.trim(),
                extraConfig: {}
            },
            {
                condition: args.inputs.radarr2_api_key?.trim(),
                type: ServiceType.RADARR,
                instance: 2,
                host: args.inputs.radarr2_host?.trim().replace(/\/$/, ''),
                apiKey: args.inputs.radarr2_api_key?.trim(),
                extraConfig: {}
            },
            {
                condition: args.inputs.sonarr1_api_key?.trim(),
                type: ServiceType.SONARR,
                instance: 1,
                host: args.inputs.sonarr1_host?.trim().replace(/\/$/, ''),
                apiKey: args.inputs.sonarr1_api_key?.trim(),
                extraConfig: { unmonitorSeries: Boolean(args.inputs.sonarr1_unmonitor_series) }
            },
            {
                condition: args.inputs.sonarr2_api_key?.trim(),
                type: ServiceType.SONARR,
                instance: 2,
                host: args.inputs.sonarr2_host?.trim().replace(/\/$/, ''),
                apiKey: args.inputs.sonarr2_api_key?.trim(),
                extraConfig: { unmonitorSeries: Boolean(args.inputs.sonarr2_unmonitor_series) }
            },
            {
                condition: args.inputs.whisparr1_api_key?.trim(),
                type: ServiceType.WHISPARR,
                instance: 1,
                host: args.inputs.whisparr1_host?.trim().replace(/\/$/, ''),
                apiKey: args.inputs.whisparr1_api_key?.trim(),
                extraConfig: {}
            },
            {
                condition: args.inputs.whisparr2_api_key?.trim(),
                type: ServiceType.WHISPARR,
                instance: 2,
                host: args.inputs.whisparr2_host?.trim().replace(/\/$/, ''),
                apiKey: args.inputs.whisparr2_api_key?.trim(),
                extraConfig: {}
            }
        ];

        for (const config of serviceConfigs) {
            if (config.condition) {
                enabledServices.push({
                    type: config.type,
                    instance: config.instance,
                    host: config.host,
                    apiKey: config.apiKey,
                    extraConfig: config.extraConfig
                });
            }
        }

        logger.success(`Found ${enabledServices.length} enabled service instance(s)`);
        
        enabledServices.forEach(service => {
            const config = service.extraConfig.unmonitorSeries ? ' (auto-unmonitor series)' : '';
            logger.extended(`${service.type.icon} ${service.type.name} ${service.instance}: ${service.host}${config}`);
        });

        // ===============================================
        // STEP 4: SERVICE PROCESSING
        // ===============================================
        
        logger.subsection('Step 4: Processing services and unmonitoring content');
        const serviceStartTime = Date.now();
        
        const results = [];
        let anySuccess = false;
        
        for (const service of enabledServices) {
            const headers = {
                'Content-Type': 'application/json',
                'X-Api-Key': service.apiKey,
                'Accept': 'application/json',
            };
            
            logger.info(`${service.type.icon} Processing ${service.type.name} Instance ${service.instance}`);
            logger.debug(`Host: ${service.host}`);
            
            let result = null;
            const serviceApiStartTime = Date.now();
            
            try {
                if (service.type === ServiceType.SONARR) {
                    result = yield unmonitorEpisode(
                        args, 
                        service.instance, 
                        service.host, 
                        headers, 
                        originalFileName, 
                        service.extraConfig.unmonitorSeries, 
                        logger
                    );
                } else {
                    result = yield unmonitorMovie(
                        args, 
                        service.type, 
                        service.instance, 
                        service.host, 
                        headers, 
                        originalFileName, 
                        logger
                    );
                }
                
                // Try with current filename if failed and different
                if (!result.success && retry_with_current && currentFileName && 
                    currentFileName !== originalFileName) {
                    logger.debug(`${service.type.icon} Instance ${service.instance} - Retrying with current filename`);
                    
                    if (service.type === ServiceType.SONARR) {
                        const retryResult = yield unmonitorEpisode(
                            args, 
                            service.instance, 
                            service.host, 
                            headers, 
                            currentFileName, 
                            service.extraConfig.unmonitorSeries, 
                            logger
                        );
                        if (retryResult.success) result = retryResult;
                    } else {
                        const retryResult = yield unmonitorMovie(
                            args, 
                            service.type, 
                            service.instance, 
                            service.host, 
                            headers, 
                            currentFileName, 
                            logger
                        );
                        if (retryResult.success) result = retryResult;
                    }
                }
                
            } catch (error) {
                logger.error(`${service.type.icon} Instance ${service.instance} - Unexpected error: ${error.message}`);
                result = { success: false, reason: `Unexpected error: ${error.message}`, methods: [] };
            }
            
            const serviceApiTime = Date.now() - serviceApiStartTime;
            processingMetrics.totalApiTime += serviceApiTime;
            processingMetrics.apiCalls++;
            
            // Store result with service information
            results.push(Object.assign(Object.assign({}, result), {
                serviceType: service.type,
                instance: service.instance,
                host: service.host,
                processingTime: serviceApiTime
            }));
            
            if (result.success) {
                anySuccess = true;
                logger.success(`${service.type.icon} Instance ${service.instance} - Operation successful`);
                
                if (stop_on_success) {
                    logger.info('✅ Stopping processing (stop on success enabled)');
                    break;
                }
            } else {
                logger.warn(`${service.type.icon} Instance ${service.instance} - Operation failed: ${result.reason}`);
            }
        }

        processingMetrics.serviceProcessingTime = Date.now() - serviceStartTime;

        // ===============================================
        // STEP 5: RESULTS ANALYSIS AND REPORTING
        // ===============================================
        
        logger.subsection('Step 5: Results analysis and reporting');
        const reportStartTime = Date.now();
        
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        logger.info(`📊 Processing Summary:`);
        logger.info(`• Services processed: ${results.length}`);
        logger.info(`• Successful operations: ${successful.length}`);
        logger.info(`• Failed operations: ${failed.length}`);
        
        // Detailed success logging
        if (successful.length > 0) {
            logger.success('✅ Successful Operations:');
            successful.forEach(result => {
                const serviceInfo = `${result.serviceType.icon} ${result.serviceType.name} ${result.instance}`;
                logger.success(`  ${serviceInfo}: ${result.reason}`);
                if (result.title) {
                    logger.extended(`    Content: ${result.title} (ID: ${result.id || 'N/A'})`);
                }
                if (result.methods && result.methods.length > 0) {
                    logger.extended(`    Detection: ${result.methods.join(', ')}`);
                }
                if (result.seriesUnmonitored) {
                    logger.extended(`    Series: ${result.seriesTitle} also unmonitored`);
                }
            });
        }
        
        // Detailed failure logging
        if (failed.length > 0) {
            logger.warn('⚠️ Failed Operations:');
            failed.forEach(result => {
                const serviceInfo = `${result.serviceType.icon} ${result.serviceType.name} ${result.instance}`;
                logger.warn(`  ${serviceInfo}: ${result.reason}`);
                if (result.methods && result.methods.length > 0) {
                    logger.extended(`    Attempted: ${result.methods.join(', ')}`);
                }
            });
        }

        // Generate detailed report if requested
        if (generateReport) {
            logger.extended('📋 Generating comprehensive processing report...');
            const report = generateProcessingReport(results, processingMetrics, args.inputs);
            logger.extended('Detailed Report Generated:');
            report.split('\n').forEach(line => {
                if (line.trim()) logger.extended(line);
            });
        }

        processingMetrics.reportGenerationTime = Date.now() - reportStartTime;
        processingMetrics.totalTime = Date.now() - startTime;

        // ===============================================
        // STEP 6: FINAL SUMMARY AND ROUTING
        // ===============================================
        
        let outputNumber;
        let finalMessage;
        
        if (anySuccess) {
            outputNumber = 1;
            finalMessage = '🎉 Plugin completed successfully - at least one item was unmonitored';
            logger.banner('✅ PROCESSING COMPLETED SUCCESSFULLY');
        } else if (results.length > 0) {
            outputNumber = 2;
            finalMessage = '⚠️ Plugin completed - no items were found or unmonitored';
            logger.banner('⚠️ NO CHANGES MADE');
        } else {
            outputNumber = 3;
            finalMessage = '❌ Plugin failed - no services processed';
            logger.banner('❌ PROCESSING FAILED');
        }
        
        logger.success(finalMessage);

        // Performance metrics
        if (showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Initialization: ${processingMetrics.initializationTime}ms`);
            logger.extended(`⏱️ Quality assurance: ${processingMetrics.qaTime}ms`);
            logger.extended(`⏱️ Service processing: ${processingMetrics.serviceProcessingTime}ms`);
            logger.extended(`⏱️ Report generation: ${processingMetrics.reportGenerationTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            if (processingMetrics.apiCalls > 0) {
                const avgApiTime = processingMetrics.totalApiTime / processingMetrics.apiCalls;
                logger.extended(`📊 API calls made: ${processingMetrics.apiCalls}`);
                logger.extended(`📊 Average API time: ${formatDuration(avgApiTime)}`);
                logger.extended(`📊 API efficiency: ${(processingMetrics.apiCalls / (totalTime / 1000)).toFixed(2)} calls/second`);
            }
        }

        // Feature utilization summary
        if (logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Quality assurance', enabled: enable_qa_checks },
                { name: 'Stop on success', enabled: stop_on_success },
                { name: 'Retry with current filename', enabled: retry_with_current },
                { name: 'Performance metrics', enabled: showPerformanceMetrics },
                { name: 'Report generation', enabled: generateReport }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`🔧 Services enabled: ${enabledServices.length}`);
            logger.debug(`📊 API timeout: ${api_timeout}s`);
            logger.debug(`⚙️ Total operations: ${results.length}`);
            logger.debug(`✅ Successful operations: ${successful.length}`);
        }

        // Enhanced variables with comprehensive information
        const updatedVariables = Object.assign(Object.assign({}, args.variables), {
            // Processing results
            unmonitor_success: anySuccess,
            unmonitor_services_processed: results.length,
            unmonitor_successful_operations: successful.length,
            unmonitor_failed_operations: failed.length,
            unmonitor_stopped_early: stop_on_success && anySuccess && results.length < enabledServices.length,
            
            // Performance metadata
            unmonitor_processing_time: processingMetrics.totalTime,
            unmonitor_api_calls: processingMetrics.apiCalls,
            unmonitor_avg_api_time: processingMetrics.apiCalls > 0 ? Math.round(processingMetrics.totalApiTime / processingMetrics.apiCalls) : 0,
            
            // Configuration metadata
            unmonitor_stop_on_success: stop_on_success,
            unmonitor_retry_enabled: retry_with_current,
            unmonitor_api_timeout: api_timeout,
            
            // Plugin metadata
            unmonitor_timestamp: new Date().toISOString(),
            unmonitor_plugin_version: '3.0'
        });

        // Add successful operation details to variables
        if (successful.length > 0) {
            const successfulServices = successful.map(r => `${r.serviceType.name}_${r.instance}`).join(',');
            updatedVariables.unmonitor_successful_services = successfulServices;
            
            const unmonitoredTitles = successful.filter(r => r.title).map(r => r.title).join(';');
            if (unmonitoredTitles) {
                updatedVariables.unmonitor_content_titles = unmonitoredTitles;
            }
        }

        logger.success('✅ Enhanced Universal Unmonitor processing complete!');
        logger.info(`🎯 Final result: ${finalMessage}`);
        logger.info('=== End of Enhanced Universal Unmonitor ===');

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