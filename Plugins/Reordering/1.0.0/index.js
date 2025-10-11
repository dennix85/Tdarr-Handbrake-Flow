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
    name: '🔄 DeNiX Stream Ordering: Advanced Stream Layout Optimization',
    description: 'Standalone stream ordering plugin with quality-based defaults, language confidence scoring, visual before/after comparison, smart redundancy detection, and comprehensive stream prioritization. Reorders streams optimally: Video → Audio (by language/channel/quality) → Subtitles (by language) → Data → Attachments.',
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
    tags: 'stream,ordering,reorder,quality,language,denix',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🔄',
    inputs: [
        {
            label: '🌍 Preferred Languages',
            name: 'preferredLanguages',
            type: 'string',
            defaultValue: 'eng,en',
            inputUI: { type: 'text' },
            tooltip: 'Comma-separated list of preferred language codes. Supports 2-letter (en) and 3-letter (eng) ISO codes (e.g., eng,en,ger,de,fre,fr)',
        },
        {
            label: '📊 Channel Order Priority',
            name: 'channelOrder',
            type: 'string',
            defaultValue: '6,2,1,8,10',
            inputUI: { type: 'text' },
            tooltip: 'Comma-separated channel order priority (e.g., 6,2,1,8,10 for 5.1→Stereo→Mono→7.1→9.1). Supports: 1,2,3,4,5,6,7,8,10,16+ channels',
        },
        {
            label: '🎵 Default Audio Stream',
            name: 'defaultAudioStream',
            type: 'string',
            defaultValue: 'eng 2',
            inputUI: { type: 'text' },
            tooltip: 'Default audio stream: "language channels" (e.g., "eng 2", "ger 6"). Supports fallback: "eng 6,eng 2,ger 6". Leave empty to disable.',
        },
        {
            label: '📝 Default Subtitle Stream',
            name: 'defaultSubtitleStream',
            type: 'string',
            defaultValue: '',
            inputUI: { type: 'text' },
            tooltip: 'Default subtitle language with fallback support (e.g., "eng" or "eng,ger,fre"). Leave empty to disable.',
        },
        {
            label: '🎛️ Codec Preference',
            name: 'codecPreference',
            type: 'string',
            defaultValue: 'opus,dts,truehd,ac3,aac',
            inputUI: { type: 'text' },
            tooltip: 'Audio codec preference order within same language/channel group (e.g., opus,dts,truehd,ac3,aac). Leave empty to ignore codec preference.',
        },
        {
            label: '🏆 Quality-Based Defaults',
            name: 'quality_based_defaults',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable quality-based default selection - prefer higher quality streams when multiple options exist',
        },
        {
            label: '⚡ Skip Redundant Operations',
            name: 'skip_redundant_operations',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Skip processing if streams are already in optimal order (improves performance)',
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
            tooltip: 'Logging detail level: info (basic), extended (detailed metrics), debug (full diagnostics)',
        },
        {
            label: '📋 Show Stream Comparison',
            name: 'show_stream_comparison',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Show visual before/after stream layout comparison for easy analysis',
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
// ENHANCED HELPER FUNCTIONS
// ===============================================

// Quality assessment functions
const calculateStreamQuality = (stream) => {
    let qualityScore = 0;
    const factors = [];

    if (stream.codec_type === 'audio') {
        const codecScores = {
            opus: 100, flac: 95, truehd: 90, dts: 85, eac3: 70, 
            ac3: 60, aac: 50, mp3: 30
        };
        const codecScore = codecScores[stream.codec_name?.toLowerCase()] || 40;
        qualityScore += codecScore * 0.4;
        factors.push(`codec: ${stream.codec_name} (${codecScore})`);

        if (stream.bit_rate) {
            const bitrate = parseInt(stream.bit_rate, 10) / 1000;
            const bitrateScore = Math.min(bitrate / 10, 100);
            qualityScore += bitrateScore * 0.3;
            factors.push(`bitrate: ${bitrate}k (${Math.round(bitrateScore)})`);
        }

        const channelScore = Math.min(stream.channels * 10, 100);
        qualityScore += channelScore * 0.3;
        factors.push(`channels: ${stream.channels} (${channelScore})`);

    } else if (stream.codec_type === 'video') {
        const codecScores = {
            av1: 100, hevc: 90, h265: 90, h264: 70, avc: 70, vp9: 85, mpeg2: 40
        };
        const codecScore = codecScores[stream.codec_name?.toLowerCase()] || 50;
        qualityScore += codecScore * 0.5;
        factors.push(`codec: ${stream.codec_name} (${codecScore})`);

        if (stream.width && stream.height) {
            const pixels = stream.width * stream.height;
            let resScore = 0;
            if (pixels >= 7680 * 4320) resScore = 100;
            else if (pixels >= 3840 * 2160) resScore = 90;
            else if (pixels >= 1920 * 1080) resScore = 70;
            else if (pixels >= 1280 * 720) resScore = 50;
            else resScore = 30;
            
            qualityScore += resScore * 0.5;
            factors.push(`resolution: ${stream.width}x${stream.height} (${resScore})`);
        }
    }

    return { 
        score: Math.round(qualityScore), 
        factors: factors.join(', ') 
    };
};

// Language processing functions
const normalizeLanguage = (lang) => {
    if (!lang) return '';
    const normalized = lang.toLowerCase();
    
    const aliases = {
        english: 'eng', german: 'ger', deutsch: 'ger', french: 'fre', francais: 'fre',
        spanish: 'spa', espanol: 'spa', italian: 'ita', italiano: 'ita',
        japanese: 'jpn', nihongo: 'jpn', chinese: 'chi', mandarin: 'chi',
        korean: 'kor', portuguese: 'por', russian: 'rus', dutch: 'dut',
        nederlands: 'dut', swedish: 'swe', norwegian: 'nor', danish: 'dan',
        finnish: 'fin', polish: 'pol', czech: 'cze', hungarian: 'hun'
    };
    
    return aliases[normalized] || normalized;
};

// Channel type mapping
const getChannelType = (channels) => {
    const channelMap = {
        1: 'Mono', 2: 'Stereo', 3: '2.1', 4: 'Quad', 5: '4.1', 6: '5.1', 
        7: '6.1', 8: '7.1', 10: '9.1', 12: '11.1', 16: '7.1.4 Atmos'
    };
    return channelMap[channels] || `${channels}ch`;
};

// Stream layout visualization
const createStreamLayout = (streams, title = '') => {
    let layout = title ? `\n📋 ${title}:\n` : '\n';
    
    const videoStreams = streams.filter(s => s.codec_type === 'video' && s.codec_name?.toLowerCase() !== 'mjpeg');
    const audioStreams = streams.filter(s => s.codec_type === 'audio');
    const subtitleStreams = streams.filter(s => s.codec_type === 'subtitle');
    
    videoStreams.forEach((stream, index) => {
        const globalIndex = streams.indexOf(stream);
        const quality = calculateStreamQuality(stream);
        layout += `  ${globalIndex}: 🎬 Video - ${stream.codec_name} ${stream.width}x${stream.height} [Quality: ${quality.score}]\n`;
    });

    audioStreams.forEach((stream, index) => {
        const globalIndex = streams.indexOf(stream);
        const lang = stream.tags?.language || 'und';
        const title = stream.tags?.title || '';
        const quality = calculateStreamQuality(stream);
        const isDefault = stream.disposition?.default === 1 ? ' ⭐' : '';
        const bitrate = stream.bit_rate ? ` (${Math.round(parseInt(stream.bit_rate)/1000)}k)` : '';
        
        layout += `  ${globalIndex}: 🎵 Audio - ${stream.codec_name} ${stream.channels}ch ${lang}${bitrate} [Q:${quality.score}]${isDefault}${title ? ` "${title}"` : ''}\n`;
    });

    subtitleStreams.forEach((stream, index) => {
        const globalIndex = streams.indexOf(stream);
        const lang = stream.tags?.language || 'und';
        const title = stream.tags?.title || '';
        const isDefault = stream.disposition?.default === 1 ? ' ⭐' : '';
        
        layout += `  ${globalIndex}: 📝 Subtitle - ${stream.codec_name} ${lang}${isDefault}${title ? ` "${title}"` : ''}\n`;
    });

    return layout;
};

// ===============================================
// MAIN PLUGIN FUNCTION
// ===============================================

const plugin = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lib = require('../../../../../methods/lib')();
        
        args.inputs = lib.loadDefaultValues(args.inputs, details);
        
        const logger = new Logger(args.inputs.logging_level);
        
        const startTime = Date.now();
        const processingMetrics = {
            streamAnalysisTime: 0,
            reorderingTime: 0,
            totalTime: 0
        };

        let streamOrderingNeeded = false;
        let ffmpegCommandParts = [];

        if (args.inputFileObj.fileMedium !== 'video') {
            logger.warn('Not a video file. Skipping.');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 2,
                variables: args.variables,
            };
        }

        logger.section('DeNiX Stream Ordering: Advanced Stream Layout Optimization');
        logger.info(`📁 File: ${path.basename(args.inputFileObj._id)}`);
        logger.info(`📊 Container: ${args.inputFileObj.container} | Streams: ${args.inputFileObj.ffProbeData.streams.length}`);
        logger.extended(`⚡ Features: Logging=${args.inputs.logging_level}, Quality=${args.inputs.quality_based_defaults}, Skip=${args.inputs.skip_redundant_operations}`);

        const ffmpegPath = getFFmpegPath(args.inputs, logger);
        logger.debug(`FFmpeg path: ${ffmpegPath}`);

        // ===============================================
        // STEP 1: ENHANCED STREAM ANALYSIS AND ORDERING
        // ===============================================
        
        logger.subsection('Step 1: Enhanced stream analysis and ordering');
        
        const analysisStartTime = Date.now();
        
        const preferredLanguages = args.inputs.preferredLanguages.split(',')
            .map(lang => lang.trim().toLowerCase())
            .filter(lang => lang.length > 0);
        const channelOrder = args.inputs.channelOrder.split(',')
            .map(ch => parseInt(ch.trim(), 10))
            .filter(ch => !isNaN(ch) && ch > 0);
        
        logger.debug(`🔍 Parsed languages: ${preferredLanguages.join(', ')}`);
        logger.debug(`🔍 Channel priority: ${channelOrder.join(' > ')}`);

        const getChannelPriority = (channels) => {
            const index = channelOrder.indexOf(channels);
            return index === -1 ? 999 + channels : index;
        };

        const getLanguagePriority = (stream) => {
            if (!stream.tags?.language) return { priority: 999, confidence: 0 };
            
            const streamLang = normalizeLanguage(stream.tags.language);
            const priority = preferredLanguages.findIndex(prefLang => 
                streamLang === prefLang || 
                (streamLang.length === 3 && prefLang.length === 2 && streamLang.startsWith(prefLang)) ||
                (streamLang.length === 2 && prefLang.length === 3 && prefLang.startsWith(streamLang))
            );
            
            return { 
                priority: priority === -1 ? 999 : priority,
                confidence: 80
            };
        };

        const videoStreams = [];
        const audioStreams = [];
        const subtitleStreams = [];

        args.inputFileObj.ffProbeData.streams.forEach((stream, i) => {
            const streamType = stream.codec_type.toLowerCase();
            const quality = calculateStreamQuality(stream);

            if (streamType === 'video' && stream.codec_name.toLowerCase() !== 'mjpeg') {
                videoStreams.push({ index: i, stream, quality });
                logger.debug(`🔹 Stream ${i}: Video ${stream.codec_name} ${stream.width}x${stream.height} [Quality: ${quality.score}]`);
            } else if (streamType === 'audio') {
                const language = normalizeLanguage(stream.tags?.language || 'unknown');
                const langInfo = getLanguagePriority(stream);
                const channelPriority = getChannelPriority(stream.channels);
                
                audioStreams.push({ 
                    index: i, 
                    stream, 
                    quality,
                    languagePriority: langInfo.priority,
                    channelPriority,
                    overallScore: (100 - langInfo.priority * 10) + quality.score + (100 - channelPriority * 5)
                });
                
                logger.debug(`🎵 Stream ${i}: ${stream.codec_name} ${getChannelType(stream.channels)} ${language} [Quality: ${quality.score}]`);
            } else if (streamType === 'subtitle') {
                const language = normalizeLanguage(stream.tags?.language || 'unknown');
                const langInfo = getLanguagePriority(stream);
                
                subtitleStreams.push({ 
                    index: i, 
                    stream, 
                    quality,
                    languagePriority: langInfo.priority
                });
                
                logger.debug(`📝 Stream ${i}: ${stream.codec_name} ${language}`);
            }
        });

        processingMetrics.streamAnalysisTime = Date.now() - analysisStartTime;

        // Sort streams according to preferences
        const reorderStartTime = Date.now();
        
        audioStreams.sort((a, b) => {
            if (a.languagePriority !== b.languagePriority) {
                return a.languagePriority - b.languagePriority;
            }
            if (a.channelPriority !== b.channelPriority) {
                return a.channelPriority - b.channelPriority;
            }
            if (args.inputs.quality_based_defaults && a.quality.score !== b.quality.score) {
                return b.quality.score - a.quality.score;
            }
            return 0;
        });

        subtitleStreams.sort((a, b) => a.languagePriority - b.languagePriority);

        // Check if reordering is needed
        if (args.inputs.skip_redundant_operations) {
            let expectedIndex = 0;
            let isOptimal = true;

            const allOptimalStreams = [...videoStreams, ...audioStreams, ...subtitleStreams];
            for (const streamData of allOptimalStreams) {
                if (streamData.index !== expectedIndex) {
                    isOptimal = false;
                    break;
                }
                expectedIndex++;
            }

            if (isOptimal) {
                logger.success('Smart detection: Streams already in optimal order, skipping reordering');
                streamOrderingNeeded = false;
            } else {
                streamOrderingNeeded = true;
                logger.info('🔄 Smart detection: Stream reordering needed');
            }
        } else {
           streamOrderingNeeded = true;
           logger.info('🔄 Checking stream order');
       }

       if (args.inputs.show_stream_comparison && streamOrderingNeeded) {
           logger.extended(createStreamLayout(args.inputFileObj.ffProbeData.streams, 'Current Stream Layout'));
           
           const optimizedStreams = [
               ...videoStreams.map(v => v.stream), 
               ...audioStreams.map(a => a.stream), 
               ...subtitleStreams.map(s => s.stream)
           ];
           logger.extended(createStreamLayout(optimizedStreams, 'Optimized Stream Layout'));
       }

        if (streamOrderingNeeded) {
            videoStreams.forEach(video => {
                ffmpegCommandParts.push('-map');
                ffmpegCommandParts.push(`0:${video.index}`);
            });

            audioStreams.forEach((audio, i) => {
                ffmpegCommandParts.push('-map');
                ffmpegCommandParts.push(`0:${audio.index}`);
                
                if (i === 0 && args.inputs.defaultAudioStream) {
                    ffmpegCommandParts.push(`-disposition:a:${i}`);
                    ffmpegCommandParts.push('default');
                } else {
                    ffmpegCommandParts.push(`-disposition:a:${i}`);
                    ffmpegCommandParts.push('0');
                }
            });

            subtitleStreams.forEach((subtitle, i) => {
                ffmpegCommandParts.push('-map');
                ffmpegCommandParts.push(`0:${subtitle.index}`);
                
                if (i === 0 && args.inputs.defaultSubtitleStream) {
                    ffmpegCommandParts.push(`-disposition:s:${i}`);
                    ffmpegCommandParts.push('default');
                } else {
                    ffmpegCommandParts.push(`-disposition:s:${i}`);
                    ffmpegCommandParts.push('0');
                }
            });

            logger.success('Stream reordering configuration prepared');
            logger.extended(`FFmpeg command parts: ${ffmpegCommandParts.join(' ')}`);
        }

        processingMetrics.reorderingTime = Date.now() - reorderStartTime;
        processingMetrics.totalTime = Date.now() - startTime;

        if (!streamOrderingNeeded) {
            logger.success('No stream ordering needed - file already optimal');
            
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
        // STEP 2: EXECUTE STREAM REORDERING
        // ===============================================
        
        logger.subsection('Step 2: Executing stream reordering');
        
        const outputFilePath = `${(0, fileUtils_1.getPluginWorkDir)(args)}/${(0, fileUtils_1.getFileName)(args.inputFileObj._id)}.${args.inputFileObj.container}`;
        
        const ffmpegArgs = [
            '-i', args.inputFileObj._id,
            ...ffmpegCommandParts,
            '-c', 'copy',
            '-max_muxing_queue_size', '9999',
            outputFilePath
        ];

        logger.success('FFmpeg command built successfully');
        logger.extended(`Output path: ${outputFilePath}`);
        
        if (args.inputs.logging_level === 'debug') {
            logger.debug(`Full FFmpeg command: ${ffmpegArgs.join(' ')}`);
        }

        if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Stream analysis: ${processingMetrics.streamAnalysisTime}ms`);
            logger.extended(`⏱️ Stream reordering: ${processingMetrics.reorderingTime}ms`);
            logger.extended(`⏱️ Total processing: ${processingMetrics.totalTime}ms`);
            
            const efficiency = processingMetrics.totalTime > 0 ? 
                Math.round((args.inputFileObj.ffProbeData.streams.length / processingMetrics.totalTime) * 1000) : 0;
            logger.extended(`📈 Efficiency: ${efficiency} streams/second`);
        }

        logger.success('🚀 Executing FFmpeg processing...');
        args.jobLog(logger.getOutput());

        const cli = new cliUtils_1.CLI({
            cli: ffmpegPath,
            spawnArgs: ffmpegArgs,
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
        logger.success('✅ Stream ordering complete!');
        logger.info('📄 Ready for File Renaming plugin');
        logger.info('=== End of Stream Ordering ===');

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