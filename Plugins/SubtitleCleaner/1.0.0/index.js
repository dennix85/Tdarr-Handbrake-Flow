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
const cliUtils_1 = require("../../../../FlowHelpers/1.0.0/cliUtils");
const os = require('os');
const fs = require('fs');
const path = require('path');

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

// Plugin details
const details = () => ({
    name: '📝 DeNiX Subtitle Cleaning: Language Filtering & Stream Management',
    description: 'Standalone subtitle cleaning plugin that filters subtitle streams by language, removes commentary/signs/songs/CC/SDH tracks, and tags unknown subtitles. Works after MKV Pre-Process conversion. Note: Subtitle format conversion (WebVTT, mov_text → SRT) should be done in Pre-Process plugin first.',
    style: {
        borderColor: '#8B4513',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        boxShadow: `
            0 0 10px rgba(139, 69, 19, 0.5),
            0 0 25px rgba(139, 69, 19, 0.46),
            0 0 40px rgba(139, 69, 19, 0.42),
            0 0 55px rgba(139, 69, 19, 0.39),
            0 0 70px rgba(139, 69, 19, 0.35),
            0 0 85px rgba(139, 69, 19, 0.31),
            0 0 100px rgba(139, 69, 19, 0.27),
            0 0 115px rgba(139, 69, 19, 0.23),
            0 0 130px rgba(139, 69, 19, 0.19),
            0 0 145px rgba(139, 69, 19, 0.17),
            0 0 160px rgba(139, 69, 19, 0.15),
            inset 0 0 20px rgba(139, 69, 19, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(139, 69, 19, 0.1), rgba(139, 69, 19, 0.15))',
    },
    tags: 'subtitle,cleaning,language,filter,denix',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '📝',
    inputs: [
        {
            label: '🗣️ Subtitle Languages',
            name: 'subtitle_languages',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Subtitle languages to keep (ISO-639-2, e.g., eng,ger,spa). Leave empty to keep all languages',
        },
        {
            label: '🗑️ Remove Commentary Subtitles',
            name: 'remove_commentary_subs',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Remove subtitle tracks that contain commentary',
        },
        {
            label: '🗑️ Remove Signs & Songs',
            name: 'remove_signs_and_songs',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Remove subtitle tracks that contain signs or songs',
        },
        {
            label: '🗑️ Remove CC/SDH',
            name: 'remove_cc_sdh',
            type: 'boolean',
            defaultValue: false,
            inputUI: { type: 'switch' },
            tooltip: 'Remove subtitle tracks that are closed captions (CC) or SDH',
        },
        {
            label: '🏷️ Tag Unknown Subtitles',
            name: 'tag_unknown_subtitles',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Tag unknown/undefined subtitle language with this code (ISO-639-2, e.g., eng). Leave empty to disable',
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
            label: '🛠️ FFmpeg Path (Linux/Docker)',
            name: 'ffmpegPath',
            type: 'string',
            defaultValue: 'ffmpeg',
            inputUI: { type: 'text' },
            tooltip: 'Path to FFmpeg binary for Linux/Docker/LXC environments (default: ffmpeg)',
        },
        {
            label: '🪟 FFmpeg Path (Windows)',
            name: 'ffmpegPathWindows',
            type: 'string',
            defaultValue: 'ffmpeg.exe',
            inputUI: { type: 'text' },
            tooltip: 'Path to FFmpeg binary for Windows environments (default: ffmpeg.exe)',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: '✅ Continue to next plugin - Processing completed successfully',
        },
        {
            number: 2,
            tooltip: '⚠️ No changes needed - File already optimal',
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
        this.output.push(`ℹ️ ${message}`);
    }

    extended(message) {
        if (this.level === 'extended' || this.level === 'debug') {
            this.output.push(`📊 ${message}`);
        }
    }

    debug(message) {
        if (this.level === 'debug') {
            this.output.push(`🔍 ${message}`);
        }
    }

    warn(message) {
        this.output.push(`⚠️ ${message}`);
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
// INPUT VALIDATION CLASS
// ===============================================

class InputValidator {
    static parseBool(value, defaultValue = false) {
        if (value === undefined || value === null) {
            return defaultValue;
        }
        
        if (typeof value === 'boolean') {
            return value;
        }
        
        if (typeof value === 'string') {
            const normalized = value.toLowerCase().trim();
            return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
        }
        
        if (typeof value === 'number') {
            return value !== 0;
        }
        
        return defaultValue;
    }
    
    static parseLanguageList(value, defaultValue = []) {
        if (!value || typeof value !== 'string') {
            return defaultValue;
        }
        
        return value.split(',')
            .map(lang => lang.trim().toLowerCase())
            .filter(lang => lang.length === 3)
            .filter(lang => LanguageMapper.isValidCode(lang));
    }
}

// ===============================================
// LANGUAGE MAPPING
// ===============================================

class LanguageMapper {
    static isValidCode(code) {
        const validLanguageCodes = [
            'aar', 'abk', 'afr', 'aka', 'alb', 'amh', 'ara', 'arg', 'arm', 'asm', 'ava', 'ave', 'aym', 'aze',
            'bak', 'bam', 'baq', 'bel', 'ben', 'bih', 'bis', 'bos', 'bre', 'bul', 'bur', 'cat', 'cha', 'che',
            'chi', 'chu', 'chv', 'cor', 'cos', 'cre', 'hrv', 'cze', 'dan', 'div', 'dut', 'dzo', 'eng', 'epo',
            'est', 'ewe', 'fao', 'fij', 'fin', 'fre', 'fry', 'ful', 'geo', 'ger', 'gla', 'gle', 'glg', 'grn',
            'guj', 'hat', 'hau', 'heb', 'her', 'hin', 'hmo', 'hun', 'ice', 'ido', 'ibo', 'ina', 'ind', 'ile',
            'iku', 'ipk', 'ita', 'jav', 'jpn', 'kal', 'kan', 'kas', 'kau', 'kaz', 'khm', 'kik', 'kin', 'kir',
            'kom', 'kon', 'kor', 'kua', 'kur', 'lao', 'lat', 'lav', 'lim', 'lin', 'lit', 'lub', 'ltz', 'lug',
            'mac', 'mah', 'mal', 'mao', 'mar', 'may', 'mlg', 'mlt', 'mon', 'nau', 'nav', 'nbl', 'nde', 'ndo',
            'nep', 'nld', 'nno', 'nob', 'nor', 'nya', 'oci', 'oji', 'ori', 'orm', 'oss', 'pan', 'per', 'pli',
            'pol', 'por', 'pus', 'que', 'roh', 'rum', 'run', 'rus', 'sag', 'san', 'sin', 'slo', 'slv', 'sme',
            'smo', 'sna', 'snd', 'som', 'sot', 'spa', 'srd', 'srp', 'ssw', 'sun', 'swa', 'swe', 'tah', 'tam',
            'tat', 'tel', 'tgk', 'tgl', 'tha', 'tib', 'tir', 'ton', 'tsn', 'tso', 'tuk', 'tur', 'twi', 'uig',
            'ukr', 'und', 'urd', 'uzb', 'ven', 'vie', 'vol', 'wel', 'wol', 'xho', 'yid', 'yor', 'zha', 'zul', 'gre'
        ];
        return validLanguageCodes.includes(code.toLowerCase());
    }
}

// ===============================================
// OS DETECTION AND FFMPEG PATH RESOLUTION
// ===============================================

const detectOperatingSystem = () => {
    const platform = os.platform();
    
    if (platform === 'win32') {
        return 'windows';
    } else if (platform === 'linux') {
        try {
            if (fs.existsSync('/.dockerenv')) {
                return 'docker';
            }
            
            if (fs.existsSync('/proc/1/environ')) {
                const environ = fs.readFileSync('/proc/1/environ', 'utf8');
                if (environ.includes('container=lxc')) {
                    return 'lxc';
                }
            }
            
            if (fs.existsSync('/proc/1/cgroup')) {
                const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
                if (cgroup.includes('docker')) {
                    return 'docker';
                } else if (cgroup.includes('lxc')) {
                    return 'lxc';
                }
            }
            
            return 'linux';
        } catch (error) {
            return 'linux';
        }
    } else if (platform === 'darwin') {
        return 'macos';
    } else {
        return 'unix';
    }
};

const getFFmpegPath = (inputs, logger) => {
    const osType = detectOperatingSystem();
    
    logger.debug(`Operating system detected: ${osType}`);
    
    if (osType === 'windows') {
        const winPath = inputs.ffmpegPathWindows || 'ffmpeg.exe';
        logger.debug(`Using Windows FFmpeg path: ${winPath}`);
        return winPath;
    } else {
        const linuxPath = inputs.ffmpegPath || 'ffmpeg';
        logger.debug(`Using Linux/Unix FFmpeg path: ${linuxPath}`);
        return linuxPath;
    }
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
        const processingMetrics = {
            streamAnalysisTime: 0,
            subtitleProcessingTime: 0,
            totalTime: 0
        };

        // Validate input file
        if (args.inputFileObj.fileMedium !== 'video') {
            logger.warn('Not a video file. Skipping.');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        logger.section('DeNiX Subtitle Cleaning: Language Filtering & Stream Management');
        logger.info(`📁 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`📊 Container: ${args.inputFileObj.container} | Streams: ${args.inputFileObj.ffProbeData.streams.length}`);

        const ffmpegPath = getFFmpegPath(args.inputs, logger);
        logger.debug(`FFmpeg path: ${ffmpegPath}`);

        // Parse subtitle languages
        const subtitleLanguages = InputValidator.parseLanguageList(args.inputs.subtitle_languages, []);
        
        if (subtitleLanguages.length > 0) {
            logger.info(`🌍 Preferred subtitle languages: ${subtitleLanguages.join(', ')}`);
        } else {
            logger.info(`🌍 No language filtering (keeping all languages)`);
        }

        // Validate tag_unknown_subtitles
        if (args.inputs.tag_unknown_subtitles && !LanguageMapper.isValidCode(args.inputs.tag_unknown_subtitles)) {
            logger.warn(`Invalid tag_unknown_subtitles code "${args.inputs.tag_unknown_subtitles}". Disabling tagging.`);
            args.inputs.tag_unknown_subtitles = '';
        }

        // ===============================================
        // STEP 1: ANALYZE SUBTITLE STREAMS
        // ===============================================
        
        logger.subsection('Step 1: Analyzing subtitle streams');
        const analysisStartTime = Date.now();
        
        const subtitleStreams = args.inputFileObj.ffProbeData.streams.filter(s => s.codec_type === 'subtitle');
        
        if (subtitleStreams.length === 0) {
            logger.success('No subtitle streams found - nothing to process');
            processingMetrics.totalTime = Date.now() - startTime;
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        logger.extended(`Found ${subtitleStreams.length} subtitle streams to analyze`);
        
        // Log current subtitle layout
        logger.extended('Current subtitle streams:');
        for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
            const stream = args.inputFileObj.ffProbeData.streams[i];
            if (stream.codec_type === 'subtitle') {
                const lang = stream.tags?.language || 'und';
                const title = stream.tags?.title || '';
                logger.extended(`  ${i}: Subtitle - ${stream.codec_name} ${lang}${title ? ` "${title}"` : ''}`);
            }
        }

        const subtitleStreamsToRemove = [];
        let needsLanguageTagging = false;

        // Analyze each subtitle stream
        for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
            const stream = args.inputFileObj.ffProbeData.streams[i];
            
            if (stream.codec_type !== 'subtitle') {
                continue;
            }

            const language = stream.tags?.language?.toLowerCase() || 'und';
            const title = stream.tags?.title?.toLowerCase() || '';
            
            let shouldRemove = false;
            let removeReason = '';

            // Check language filtering
            if (subtitleLanguages.length > 0 && !subtitleLanguages.includes(language) && language !== 'und') {
                shouldRemove = true;
                removeReason = `language "${language}" not in preferred languages`;
            }

            // Check for commentary
            if (InputValidator.parseBool(args.inputs.remove_commentary_subs, false) && title.includes('commentary')) {
                shouldRemove = true;
                removeReason = 'commentary track';
            }

            // Check for signs/songs
            if (InputValidator.parseBool(args.inputs.remove_signs_and_songs, false) && (title.includes('signs') || title.includes('songs'))) {
                shouldRemove = true;
                removeReason = 'signs/songs track';
            }

            // Check for CC/SDH
            if (InputValidator.parseBool(args.inputs.remove_cc_sdh, false) && (title.includes('cc') || title.includes('sdh'))) {
                shouldRemove = true;
                removeReason = 'CC/SDH track';
            }

            if (shouldRemove) {
                subtitleStreamsToRemove.push(i);
                logger.info(`🗑️ Subtitle ${i}: ${removeReason}`);
            } else {
                logger.success(`✅ Subtitle ${i}: Language "${language}" kept`);
                
                // Check if needs language tagging
                if (args.inputs.tag_unknown_subtitles && 
                    LanguageMapper.isValidCode(args.inputs.tag_unknown_subtitles) && 
                    (language === 'und' || !stream.tags || !stream.tags.language)) {
                    needsLanguageTagging = true;
                    logger.info(`🏷️ Subtitle ${i}: Will be tagged as ${args.inputs.tag_unknown_subtitles}`);
                }
            }
        }

        processingMetrics.streamAnalysisTime = Date.now() - analysisStartTime;

        // ===============================================
        // STEP 2: DETERMINE IF PROCESSING IS NEEDED
        // ===============================================
        
        logger.subsection('Step 2: Processing summary');
        logger.info(`Subtitle streams to remove: ${subtitleStreamsToRemove.length}`);
        logger.info(`Language tagging needed: ${needsLanguageTagging ? 'Yes' : 'No'}`);

        const needsProcessing = subtitleStreamsToRemove.length > 0 || needsLanguageTagging;

        if (!needsProcessing) {
            logger.success('No subtitle processing needed - all streams already optimal');
            
            processingMetrics.totalTime = Date.now() - startTime;
            if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
                logger.subsection('Performance Metrics');
                logger.extended(`⏱️ Stream analysis: ${processingMetrics.streamAnalysisTime}ms`);
                logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
            }
            
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        // ===============================================
        // STEP 3: BUILD FFMPEG COMMAND
        // ===============================================
        
        logger.subsection('Step 3: Building FFmpeg command');
        const subtitleStartTime = Date.now();
        
        const workDir = (0, fileUtils_1.getPluginWorkDir)(args);
        const outputFilePath = path.join(workDir, `${path.parse(args.inputFileObj._id).name}.${args.inputFileObj.container}`);
        
        let muxArgs = ['-i', args.inputFileObj._id];
        
        // Map video streams
        muxArgs.push('-map', '0:v');
        
        // Map audio streams
        muxArgs.push('-map', '0:a');
        
        // Map subtitle streams (excluding removed ones)
        for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
            const stream = args.inputFileObj.ffProbeData.streams[i];
            if (stream.codec_type === 'subtitle' && !subtitleStreamsToRemove.includes(i)) {
                muxArgs.push('-map', `0:${i}`);
            }
        }
        
        // Copy all codecs
        muxArgs.push('-c', 'copy');
        
        // Apply language tagging if needed
        if (needsLanguageTagging) {
            let subtitleOutputIndex = 0;
            for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i++) {
                const stream = args.inputFileObj.ffProbeData.streams[i];
                
                if (stream.codec_type === 'subtitle' && !subtitleStreamsToRemove.includes(i)) {
                    const language = stream.tags?.language?.toLowerCase() || 'und';
                    
                    if (language === 'und' || !stream.tags || !stream.tags.language) {
                        muxArgs.push(`-metadata:s:s:${subtitleOutputIndex}`, `language=${args.inputs.tag_unknown_subtitles}`);
                        logger.info(`🏷️ Tagging subtitle ${i} (s:${subtitleOutputIndex}) as ${args.inputs.tag_unknown_subtitles}`);
                    }
                    subtitleOutputIndex++;
                }
            }
        }
        
        // Add max muxing queue size
        muxArgs.push('-max_muxing_queue_size', '9999');
        
        // Add output file
        muxArgs.push('-y', outputFilePath);

        logger.success('FFmpeg command built successfully');
        logger.extended(`Output path: ${outputFilePath}`);
        
        if (args.inputs.logging_level === 'debug') {
            logger.debug(`Full FFmpeg command: ${muxArgs.join(' ')}`);
        }

        processingMetrics.subtitleProcessingTime = Date.now() - subtitleStartTime;

        // Performance metrics before execution
        processingMetrics.totalTime = Date.now() - startTime;
        if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Stream analysis: ${processingMetrics.streamAnalysisTime}ms`);
            logger.extended(`⏱️ Subtitle processing: ${processingMetrics.subtitleProcessingTime}ms`);
            logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
        }

        logger.success('🚀 Executing FFmpeg processing...');
        args.jobLog(logger.getOutput());

        // ===============================================
        // STEP 4: EXECUTE FFMPEG
        // ===============================================

        const cli = new cliUtils_1.CLI({
            cli: ffmpegPath,
            spawnArgs: muxArgs,
            spawnOpts: {},
            jobLog: args.jobLog,
            outputFilePath,
            inputFileObj: args.inputFileObj,
            logFullCliOutput: args.logFullCliOutput,
            updateWorker: args.updateWorker,
            args,
        });

        const res = yield cli.runCli();

        if (res.cliExitCode !== 0) {
            logger.error(`FFmpeg failed with exit code: ${res.cliExitCode}`);
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 3,
                variables: args.variables,
            };
        }

        logger.success('FFmpeg processing completed successfully');
        logger.success('✅ Subtitle cleaning complete!');
        logger.info('📄 Ready for next stage processing');
        logger.info('=== End of Subtitle Cleaning ===');

        args.jobLog(logger.getOutput());

        return {
            outputFileObj: {
                _id: outputFilePath,
            },
            outputNumber: 1,
            variables: args.variables,
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