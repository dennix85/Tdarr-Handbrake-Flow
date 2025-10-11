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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const fileUtils_1 = require("../../../../FlowHelpers/1.0.0/fileUtils");

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details
const details = () => ({
    name: '🚀 DeNiX Enhanced Input File: Advanced Validation & Analysis',
    description: 'Enhanced input file plugin with comprehensive file analysis, advanced access validation, detailed system reporting, and quality assurance checks. Features environment-aware processing and performance metrics.',
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
    tags: 'start,input,validation,analysis,enhanced',
    isStartPlugin: true,
    pType: 'start',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🚀',
    inputs: [
        {
            label: '🔐 File Access Checks',
            name: 'fileAccessChecks',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Enable comprehensive file access validation including read/write permissions and cache directory checks',
        },
        {
            label: '⏸️ Pause Node If Access Checks Fail',
            name: 'pauseNodeIfAccessChecksFail',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Automatically pause the node if file access validation fails (requires access checks to be enabled)',
        },
        {
            label: '📊 Show File Summary',
            name: 'showFileSummary',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Display detailed file information including metadata, permissions, timestamps, and format analysis',
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
            tooltip: '✅ Continue to next plugin - File validation and analysis completed',
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

// Format file size helper
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Get file extension icon
const getFileIcon = (extension) => {
    const icons = {
        '.mp4': '🎬', '.avi': '🎬', '.mkv': '🎬', '.mov': '🎬', '.wmv': '🎬',
        '.flv': '🎬', '.webm': '🎬', '.m4v': '🎬', '.mp3': '🎵', '.wav': '🎵',
        '.flac': '🎵', '.aac': '🎵', '.ogg': '🎵', '.m4a': '🎵', '.jpg': '🖼️',
        '.jpeg': '🖼️', '.png': '🖼️', '.gif': '🖼️', '.bmp': '🖼️', '.webp': '🖼️',
        '.svg': '🖼️', '.pdf': '📄', '.txt': '📝', '.doc': '📝', '.docx': '📝',
        '.srt': '💬', '.sub': '💬', '.ass': '💬', '.vtt': '💬'
    };
    return icons[extension.toLowerCase()] || '📄';
};

// Get file format details
const getFileFormatDetails = (extension) => {
    const formats = {
        '.mp4': { category: 'Video', description: 'MPEG-4 Video Container', typical: 'Common web video format' },
        '.avi': { category: 'Video', description: 'Audio Video Interleave', typical: 'Legacy Windows video format' },
        '.mkv': { category: 'Video', description: 'Matroska Video Container', typical: 'Open-source container format' },
        '.mov': { category: 'Video', description: 'QuickTime Movie', typical: 'Apple video format' },
        '.wmv': { category: 'Video', description: 'Windows Media Video', typical: 'Microsoft video format' },
        '.flv': { category: 'Video', description: 'Flash Video', typical: 'Adobe Flash video format' },
        '.webm': { category: 'Video', description: 'WebM Video', typical: 'Google web video format' },
        '.m4v': { category: 'Video', description: 'MPEG-4 Video', typical: 'iTunes video format' },
        '.mp3': { category: 'Audio', description: 'MPEG Audio Layer 3', typical: 'Common audio format' },
        '.wav': { category: 'Audio', description: 'Waveform Audio', typical: 'Uncompressed audio format' },
        '.flac': { category: 'Audio', description: 'Free Lossless Audio Codec', typical: 'Lossless audio format' },
        '.aac': { category: 'Audio', description: 'Advanced Audio Coding', typical: 'Modern audio format' },
        '.ogg': { category: 'Audio', description: 'Ogg Vorbis', typical: 'Open-source audio format' },
        '.m4a': { category: 'Audio', description: 'MPEG-4 Audio', typical: 'iTunes audio format' },
        '.srt': { category: 'Subtitle', description: 'SubRip Subtitle', typical: 'Plain text subtitle format' },
        '.sub': { category: 'Subtitle', description: 'MicroDVD Subtitle', typical: 'Frame-based subtitle format' },
        '.ass': { category: 'Subtitle', description: 'Advanced SubStation Alpha', typical: 'Advanced subtitle format' },
        '.vtt': { category: 'Subtitle', description: 'WebVTT Subtitle', typical: 'Web video subtitle format' }
    };
    
    return formats[extension.toLowerCase()] || { 
        category: 'Unknown', 
        description: 'Unknown format', 
        typical: 'Unknown file type' 
    };
};

// Get system information
const getSystemInfo = () => {
    const os = require('os');
    return {
        platform: os.platform(),
        architecture: os.arch(),
        hostname: os.hostname(),
        totalMemory: formatFileSize(os.totalmem()),
        freeMemory: formatFileSize(os.freemem()),
        uptime: Math.floor(os.uptime() / 3600) + 'h ' + Math.floor((os.uptime() % 3600) / 60) + 'm',
        loadAverage: os.loadavg(),
        cpuCores: os.cpus().length,
        nodeVersion: process.version
    };
};

// Enhanced file summary function
const getFileSummary = (fileObj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield fs_1.promises.stat(fileObj.file);
        const filePath = fileObj.file;
        const fileName = path_1.basename(filePath);
        const fileExt = path_1.extname(filePath);
        const fileIcon = getFileIcon(fileExt);
        const formatDetails = getFileFormatDetails(fileExt);

        return {
            icon: fileIcon,
            name: fileName,
            path: filePath,
            directory: path_1.dirname(filePath),
            size: formatFileSize(stats.size),
            sizeBytes: stats.size,
            extension: fileExt,
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            accessed: stats.atime.toISOString(),
            type: stats.isDirectory() ? 'Directory' : 'File',
            permissions: '0' + (stats.mode & parseInt('777', 8)).toString(8),
            formatDetails: formatDetails,
            isReadable: (stats.mode & parseInt('444', 8)) !== 0,
            isWritable: (stats.mode & parseInt('222', 8)) !== 0,
            isExecutable: (stats.mode & parseInt('111', 8)) !== 0,
            ino: stats.ino,
            dev: stats.dev,
            nlink: stats.nlink,
            uid: stats.uid,
            gid: stats.gid,
            blocks: stats.blocks,
            blksize: stats.blksize
        };
    } catch (err) {
        return {
            icon: '❓',
            name: 'Unknown',
            path: fileObj.file,
            directory: 'Unknown',
            size: 'Unknown',
            sizeBytes: 0,
            extension: 'Unknown',
            created: 'Unknown',
            modified: 'Unknown',
            accessed: 'Unknown',
            type: 'Unknown',
            permissions: 'Unknown',
            formatDetails: { category: 'Unknown', description: 'Unknown', typical: 'Unknown' },
            isReadable: false,
            isWritable: false,
            isExecutable: false,
            error: err.message
        };
    }
});

// Quality assurance checks
const performQualityAssurance = (fileObj, originalLibraryFile, inputs, logger) => {
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
        // Validate input file object
        if (!fileObj || !fileObj.file) {
            result.canProcess = false;
            result.errorMessage = 'Invalid input file object - missing file property';
            return result;
        }

        // Validate original library file
        if (!originalLibraryFile || !originalLibraryFile._id) {
            result.canProcess = false;
            result.errorMessage = 'Invalid original library file - missing _id property';
            return result;
        }

        // Check file path validity
        if (typeof fileObj.file !== 'string' || fileObj.file.length === 0) {
            result.canProcess = false;
            result.errorMessage = 'Invalid file path - empty or non-string value';
            return result;
        }

        // Check if file exists
        try {
            require('fs').accessSync(fileObj.file, require('fs').constants.F_OK);
        } catch (err) {
            result.canProcess = false;
            result.errorMessage = `File does not exist or is not accessible: ${fileObj.file}`;
            return result;
        }

        // Validate file extension
        const extension = path_1.extname(fileObj.file);
        if (!extension) {
            result.warnings.push('File has no extension - may cause processing issues');
        }

        // Check for potential path issues
        if (fileObj.file.includes('..')) {
            result.warnings.push('File path contains relative references (..) - potential security concern');
        }

        if (fileObj.file.length > 260) {
            result.warnings.push('File path is very long (>260 chars) - may cause issues on some systems');
        }

        logger.success('Quality assurance validation completed');

    } catch (err) {
        result.warnings.push(`QA check encountered error: ${err.message}`);
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
            accessCheckTime: 0,
            fileSummaryTime: 0,
            totalTime: 0
        };

        // Extract inputs using destructuring
        const {
            fileAccessChecks,
            pauseNodeIfAccessChecksFail,
            showFileSummary,
            enable_qa_checks,
            logging_level,
            showPerformanceMetrics
        } = args.inputs;

        logger.section('DeNiX Enhanced Input File: Advanced Validation & Analysis');
        logger.info(`📁 Input File: ${path_1.basename(args.inputFileObj.file)}`);
        logger.info(`📂 Directory: ${path_1.dirname(args.inputFileObj.file)}`);

        // ===============================================
        // STEP 1: INITIALIZATION AND SYSTEM INFO
        // ===============================================
        
        logger.subsection('Step 1: System initialization and configuration');
        const initStartTime = Date.now();

        // Get basic configuration
        const originalFolder = (0, fileUtils_1.getFileAbosluteDir)(args.originalLibraryFile._id);
        const nodeID = process.argv[8];
        const { serverIP, serverPort } = args.deps.configVars.config;
        const url = `http://${serverIP}:${serverPort}/api/v2/update-node`;

        // System information
        const systemInfo = getSystemInfo();
        
        logger.extended(`Platform: ${systemInfo.platform} (${systemInfo.architecture})`);
        logger.extended(`Hostname: ${systemInfo.hostname}`);
        logger.extended(`Node.js: ${systemInfo.nodeVersion}`);
        logger.extended(`CPU Cores: ${systemInfo.cpuCores}`);
        logger.extended(`Memory: ${systemInfo.freeMemory} free / ${systemInfo.totalMemory} total`);
        logger.extended(`Uptime: ${systemInfo.uptime}`);
        logger.extended(`Load Average: [${systemInfo.loadAverage.map(load => load.toFixed(2)).join(', ')}]`);

        // Configuration logging
        logger.debug(`🔐 File Access Checks: ${fileAccessChecks ? 'Enabled' : 'Disabled'}`);
        logger.debug(`⏸️ Pause on Access Failure: ${pauseNodeIfAccessChecksFail ? 'Enabled' : 'Disabled'}`);
        logger.debug(`📊 Show File Summary: ${showFileSummary ? 'Enabled' : 'Disabled'}`);
        logger.debug(`🛡️ Quality Assurance: ${enable_qa_checks ? 'Enabled' : 'Disabled'}`);
        logger.debug(`📊 Logging Level: ${logging_level}`);
        logger.debug(`⏱️ Performance Metrics: ${showPerformanceMetrics ? 'Enabled' : 'Disabled'}`);
        logger.debug(`🆔 Node ID: ${nodeID}`);
        logger.debug(`🌐 Server: ${serverIP}:${serverPort}`);
        logger.debug(`📂 Original Folder: ${originalFolder}`);
        logger.debug(`💾 Cache Location: ${args.librarySettings.cache}`);

        processingMetrics.initializationTime = Date.now() - initStartTime;

        // ===============================================
        // STEP 2: QUALITY ASSURANCE CHECKS
        // ===============================================
        
        logger.subsection('Step 2: Quality assurance and validation');
        const qaStartTime = Date.now();

        const validationResult = performQualityAssurance(
            args.inputFileObj, 
            args.originalLibraryFile, 
            args.inputs,
            logger
        );

        if (!validationResult.canProcess) {
            logger.error(validationResult.errorMessage);
            throw new Error(validationResult.errorMessage);
        }

        if (validationResult.warnings.length > 0) {
            validationResult.warnings.forEach(warning => logger.warn(warning));
        } else {
            logger.success('All quality assurance checks passed');
        }

        processingMetrics.qaTime = Date.now() - qaStartTime;

        // ===============================================
        // STEP 3: FILE SUMMARY ANALYSIS
        // ===============================================
        
        if (showFileSummary) {
            logger.subsection('Step 3: File analysis and summary');
            const summaryStartTime = Date.now();

            const fileSummary = yield getFileSummary(args.inputFileObj);

            // Basic file information
            logger.info(`📄 Name: ${fileSummary.icon} ${fileSummary.name}`);
            logger.info(`📏 Size: ${fileSummary.size} (${fileSummary.sizeBytes.toLocaleString()} bytes)`);
            logger.info(`📂 Directory: ${fileSummary.directory}`);
            logger.info(`🏷️ Extension: ${fileSummary.extension}`);
            logger.info(`📋 Type: ${fileSummary.type}`);

            // Format details
            logger.extended(`🎭 Category: ${fileSummary.formatDetails.category}`);
            logger.extended(`📝 Description: ${fileSummary.formatDetails.description}`);
            logger.extended(`💡 Typical Use: ${fileSummary.formatDetails.typical}`);

            // Permission information
            logger.extended(`🔐 Permissions: ${fileSummary.permissions}`);
            logger.extended(`👁️ Readable: ${fileSummary.isReadable ? 'Yes' : 'No'}`);
            logger.extended(`✏️ Writable: ${fileSummary.isWritable ? 'Yes' : 'No'}`);
            logger.extended(`⚡ Executable: ${fileSummary.isExecutable ? 'Yes' : 'No'}`);

            // Timestamp information
            if (fileSummary.created !== 'Unknown') {
                const createdDate = new Date(fileSummary.created);
                const modifiedDate = new Date(fileSummary.modified);
                const accessedDate = new Date(fileSummary.accessed);

                logger.extended(`🕐 Created: ${createdDate.toLocaleString()}`);
                logger.extended(`🕐 Modified: ${modifiedDate.toLocaleString()}`);
                logger.extended(`🕐 Accessed: ${accessedDate.toLocaleString()}`);

                const now = new Date();
                const daysSinceModified = Math.floor((now.getTime() - modifiedDate.getTime()) / (1000 * 60 * 60 * 24));
                const daysSinceAccessed = Math.floor((now.getTime() - accessedDate.getTime()) / (1000 * 60 * 60 * 24));

                logger.extended(`📅 Days since modified: ${daysSinceModified}`);
                logger.extended(`📅 Days since accessed: ${daysSinceAccessed}`);
            } else {
                logger.warn('Timestamp information unavailable');
            }

            // File system information
            if (fileSummary.ino !== undefined) {
                logger.debug(`💾 Inode: ${fileSummary.ino}`);
                logger.debug(`💾 Device: ${fileSummary.dev}`);
                logger.debug(`💾 Links: ${fileSummary.nlink}`);
                logger.debug(`👤 User ID: ${fileSummary.uid}`);
                logger.debug(`👥 Group ID: ${fileSummary.gid}`);
                
                if (fileSummary.blocks) {
                    logger.debug(`💾 Disk Blocks: ${fileSummary.blocks}`);
                    logger.debug(`💾 Block Size: ${fileSummary.blksize} bytes`);
                }
            }

            if (fileSummary.error) {
                logger.error(`File analysis error: ${fileSummary.error}`);
            }

            processingMetrics.fileSummaryTime = Date.now() - summaryStartTime;
        } else {
            logger.info('⏭️ Step 3: File summary disabled');
            processingMetrics.fileSummaryTime = 0;
        }

        // ===============================================
        // STEP 4: FILE ACCESS VALIDATION
        // ===============================================
        
        if (fileAccessChecks) {
            logger.subsection('Step 4: File access validation');
            const accessStartTime = Date.now();

            let pauseNode = false;

            // Helper function for access checks
            const checkReadWrite = (filePath, description) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    logger.extended(`Analyzing location: ${filePath}`);
                    
                    // Get location stats
                    try {
                        const locationStats = yield fs_1.promises.stat(filePath);
                        logger.debug(`Location type: ${locationStats.isDirectory() ? 'Directory' : 'File'}`);
                        logger.debug(`Location size: ${formatFileSize(locationStats.size)}`);
                        logger.debug(`Location permissions: 0${(locationStats.mode & parseInt('777', 8)).toString(8)}`);
                    } catch (err) {
                        logger.warn(`Could not get location stats: ${err.message}`);
                    }

                    // Test read access
                    try {
                        yield fs_1.promises.access(filePath, fs_1.constants.R_OK);
                        logger.success(`${description} is readable`);
                    } catch (err) {
                        logger.error(`${description} read access failed: ${err.message}`);
                        pauseNode = true;
                        if (pauseNodeIfAccessChecksFail) {
                            throw new Error(`Location not readable: ${filePath}`);
                        }
                    }
                    
                    // Test write access
                    try {
                        yield fs_1.promises.access(filePath, fs_1.constants.W_OK);
                        logger.success(`${description} is writable`);
                    } catch (err) {
                        logger.error(`${description} write access failed: ${err.message}`);
                        pauseNode = true;
                        if (pauseNodeIfAccessChecksFail) {
                            throw new Error(`Location not writable: ${filePath}`);
                        }
                    }
                    
                    if (!pauseNode) {
                        logger.success(`Full access confirmed for: ${filePath}`);
                    }
                } catch (err) {
                    logger.error(`Access check failed for ${description}: ${err.message}`);
                    if (pauseNodeIfAccessChecksFail) {
                        try {
                            // Pause the node using the API
                            const requestConfig = {
                                method: 'post',
                                url: url,
                                headers: {},
                                data: {
                                    data: {
                                        nodeID: nodeID,
                                        nodeUpdates: {
                                            nodePaused: true,
                                        },
                                    },
                                },
                            };
                            yield args.deps.axios(requestConfig);
                            logger.warn('Node has been paused due to access check failure');
                        } catch (pauseErr) {
                            logger.error(`Failed to pause node: ${pauseErr.message}`);
                        }
                        throw err;
                    }
                }
            });

            // Check original folder access
            yield checkReadWrite(originalFolder, 'Original folder');

            // Check cache directory access
            yield checkReadWrite(args.librarySettings.cache, 'Cache directory');

            if (!pauseNode) {
                logger.success('All file access checks passed');
            } else {
                logger.warn('Access checks failed but node pause is disabled');
            }

            processingMetrics.accessCheckTime = Date.now() - accessStartTime;
        } else {
            logger.info('⏭️ Step 4: File access validation disabled');
            processingMetrics.accessCheckTime = 0;
        }

        // ===============================================
        // STEP 5: FINAL PROCESSING AND RESULTS
        // ===============================================
        
        processingMetrics.totalTime = Date.now() - startTime;

        logger.subsection('Step 5: Processing summary and results');

        // Enhanced variables with processing information
        const updatedVariables = {
            ...args.variables,
            input_file_validation_passed: true,
            input_file_access_checks_performed: fileAccessChecks,
            input_file_summary_generated: showFileSummary,
            input_file_qa_checks_performed: enable_qa_checks,
            input_file_processing_time: processingMetrics.totalTime,
            input_file_name: path_1.basename(args.inputFileObj.file),
            input_file_directory: path_1.dirname(args.inputFileObj.file),
            input_file_extension: path_1.extname(args.inputFileObj.file)
        };

        // Performance metrics
        if (args.inputs.showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Initialization: ${processingMetrics.initializationTime}ms`);
            logger.extended(`⏱️ Quality assurance: ${processingMetrics.qaTime}ms`);
            logger.extended(`⏱️ File summary: ${processingMetrics.fileSummaryTime}ms`);
            logger.extended(`⏱️ Access validation: ${processingMetrics.accessCheckTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            const efficiency = totalTime > 0 ? Math.round((1000 / totalTime) * 100) / 100 : 0;
            logger.extended(`📈 Processing efficiency: ${efficiency} files/second`);

            // Add performance metrics to variables
            Object.assign(updatedVariables, {
                input_file_processing_time_detailed: {
                    initialization: processingMetrics.initializationTime,
                    qa_checks: processingMetrics.qaTime,
                    file_summary: processingMetrics.fileSummaryTime,
                    access_validation: processingMetrics.accessCheckTime,
                    total: Math.round(totalTime)
                }
            });
        }

        // Feature utilization summary
        if (args.inputs.logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Quality assurance', enabled: enable_qa_checks },
                { name: 'File access checks', enabled: fileAccessChecks },
                { name: 'File summary generation', enabled: showFileSummary },
                { name: 'Performance metrics', enabled: showPerformanceMetrics },
                { name: 'Node auto-pause', enabled: pauseNodeIfAccessChecksFail }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`📊 Validation warnings: ${validationResult.warnings.length}`);
            logger.debug(`📋 Variables created: ${Object.keys(updatedVariables).length}`);
        }

        // Processing completion summary
        logger.success('Input file validation completed successfully');
        logger.info('All required checks passed - file is ready for processing');
        logger.success('✅ Enhanced Input File processing complete!');
        logger.info('🔄 Ready to proceed to next plugin in flow');
        logger.info('=== End of Enhanced Input File Processing ===');

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
        throw new Error(`Enhanced Input File Plugin failed: ${error.message}`);
    }
});

exports.plugin = plugin;