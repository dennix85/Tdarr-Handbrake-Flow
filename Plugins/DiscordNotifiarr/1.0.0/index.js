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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
const path_1 = __importDefault(require("path"));

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

const details = () => ({
    name: '🔔 DeNiX Discord Notification: Enhanced Transcoding Reports',
    description: 'Send detailed Discord notifications with comprehensive transcoding statistics, codec information, file size comparisons, and processing metrics. Features rich embed formatting and intelligent data presentation for easy monitoring. This is an end plugin - no outputs.',
    style: {
        borderColor: '#5865F2',
        backgroundColor: 'rgba(88, 101, 242, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        boxShadow: `
            0 0 10px rgba(88, 101, 242, 0.5),
            0 0 25px rgba(88, 101, 242, 0.46),
            0 0 40px rgba(88, 101, 242, 0.42),
            0 0 55px rgba(88, 101, 242, 0.39),
            0 0 70px rgba(88, 101, 242, 0.35),
            0 0 85px rgba(88, 101, 242, 0.31),
            0 0 100px rgba(88, 101, 242, 0.27),
            0 0 115px rgba(88, 101, 242, 0.23),
            0 0 130px rgba(88, 101, 242, 0.19),
            0 0 145px rgba(88, 101, 242, 0.17),
            0 0 160px rgba(88, 101, 242, 0.15),
            inset 0 0 20px rgba(88, 101, 242, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(88, 101, 242, 0.1), rgba(88, 101, 242, 0.15))',
    },
    tags: 'notification,discord,webhook,monitoring,denix,end-plugin',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.18.01',
    sidebarPosition: -1,
    icon: '🔔',
    inputs: [
        {
            label: '🌐 Discord Webhook URL',
            name: 'discordUrl',
            type: 'string',
            defaultValue: '',
            inputUI: {
                type: 'textarea',
                style: {
                    height: '100px',
                },
            },
            tooltip: 'Discord webhook URL to send notifications to. Get this from Discord Server Settings → Integrations → Webhooks',
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
            tooltip: 'Logging level: info (basic), extended (detailed metrics), debug (full diagnostics)',
        },
    ],
    outputs: [],
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
// HELPER FUNCTIONS
// ===============================================

const formatChannels = (channels) => {
    switch (channels) {
        case 8:
            return '7.1';
        case 6:
            return '5.1';
        case 2:
            return '2.0';
        case 1:
            return 'mono';
        default:
            return `${channels}.0`;
    }
};

const formatFileSize = (sizeInMB) => {
    if (sizeInMB >= 1024) {
        return `${(sizeInMB / 1024).toFixed(2)} GB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
};

const formatDuration = (startDate, endDate) => {
    const duration = new Date(endDate.getTime() - startDate.getTime());
    return duration.toISOString().slice(11, 19);
};

// ===============================================
// MAIN PLUGIN FUNCTION
// ===============================================

const plugin = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    
    try {
        const lib = require('../../../../../methods/lib')();
        args.inputs = lib.loadDefaultValues(args.inputs, details);
        
        const logger = new Logger(args.inputs.logging_level);
        const startTime = Date.now();

        const { discordUrl } = args.inputs;

        logger.section('DeNiX Discord Notification: Enhanced Transcoding Reports');
        logger.info(`📁 File: ${path_1.default.basename(args.inputFileObj.file)}`);

        // Validate Discord URL
        if (!discordUrl || discordUrl.trim() === '') {
            logger.error('Discord webhook URL is not configured');
            args.jobLog(logger.getOutput());
            return {
                outputFileObj: args.inputFileObj,
                outputNumber: 1,
                variables: args.variables,
            };
        }

        logger.debug(`🌐 Webhook URL configured: ${discordUrl.substring(0, 50)}...`);

        // ===============================================
        // STEP 1: GATHER TRANSCODING STATISTICS
        // ===============================================
        
        logger.subsection('Step 1: Gathering transcoding statistics');

        const currentDateTime = new Date();
        const startDateTime = new Date(args.job.start);
        const duration = formatDuration(startDateTime, currentDateTime);

        logger.extended(`⏱️  Job started: ${startDateTime.toISOString()}`);
        logger.extended(`⏱️  Job ended: ${currentDateTime.toISOString()}`);
        logger.extended(`⏱️  Duration: ${duration}`);

        const oldFilenameWithoutExt = path_1.default.parse(args.originalLibraryFile.file).name;
        const newFilename = path_1.default.basename(args.inputFileObj.file);

        // Video stream analysis
        const originalVideoStream = ((_a = args.originalLibraryFile.ffProbeData.streams) === null || _a === void 0 ? void 0 : _a.at(args.originalLibraryFile.videoStreamIndex)) || null;
        const currentVideoStream = ((_b = args.inputFileObj.ffProbeData.streams) === null || _b === void 0 ? void 0 : _b.at(args.inputFileObj.videoStreamIndex)) || null;

        const originalVideoBitDepth = (originalVideoStream === null || originalVideoStream === void 0 ? void 0 : originalVideoStream.profile) === 'Main 10' || 
                                      (originalVideoStream === null || originalVideoStream === void 0 ? void 0 : originalVideoStream.bits_per_raw_sample) === '10' ? 10 : 8;
        const currentVideoBitDepth = (currentVideoStream === null || currentVideoStream === void 0 ? void 0 : currentVideoStream.profile) === 'Main 10' || 
                                     (currentVideoStream === null || currentVideoStream === void 0 ? void 0 : currentVideoStream.bits_per_raw_sample) === '10' ? 10 : 8;

        logger.extended(`🎬 Original codec: ${args.originalLibraryFile.video_codec_name} (${originalVideoBitDepth}bit)`);
        logger.extended(`🎬 New codec: ${args.inputFileObj.video_codec_name.toUpperCase()} (${currentVideoBitDepth}bit)`);

        // Audio stream analysis
        const originalFileAudioStreams = (_c = args.originalLibraryFile.ffProbeData.streams) === null || _c === void 0 ? void 0 : _c
            .filter((stream) => stream.codec_type === 'audio')
            .map((stream) => `${(stream.codec_name || 'unknown').toUpperCase()} ${formatChannels(stream.channels || 0)}`);

        const currentFileAudioStreams = (_d = args.inputFileObj.ffProbeData.streams) === null || _d === void 0 ? void 0 : _d
            .filter((stream) => stream.codec_type === 'audio')
            .map((stream) => `${(stream.codec_name || 'unknown').toUpperCase()} ${formatChannels(stream.channels || 0)}`);

        logger.extended(`🎵 Original audio: ${originalFileAudioStreams.join(', ')}`);
        logger.extended(`🎵 New audio: ${currentFileAudioStreams.join(', ')}`);

        // File size analysis
        const originalFileSizeInMB = args.originalLibraryFile.file_size;
        const currentFileSizeInMB = args.inputFileObj.file_size;
        const spaceSavedInMB = originalFileSizeInMB - currentFileSizeInMB;
        const spaceSavedPercentage = (spaceSavedInMB / originalFileSizeInMB) * 100;
        const newFilePercentageOfOriginal = (currentFileSizeInMB / originalFileSizeInMB) * 100;

        logger.extended(`💾 Original size: ${formatFileSize(originalFileSizeInMB)}`);
        logger.extended(`💾 New size: ${formatFileSize(currentFileSizeInMB)}`);
        logger.extended(`💾 Space saved: ${formatFileSize(spaceSavedInMB)} (${spaceSavedPercentage.toFixed(2)}%)`);

        // ===============================================
        // STEP 2: BUILD DISCORD EMBED
        // ===============================================
        
        logger.subsection('Step 2: Building Discord embed');

        const embed = {
            title: `🎬 Transcoding Complete`,
            description: `**${oldFilenameWithoutExt}**`,
            color: 0x5865F2, // Discord blue
            fields: [
                {
                    name: '📦 Container & Video',
                    value: `**Container:** ${args.inputFileObj.container.toUpperCase()}\n**Codec:** ${args.originalLibraryFile.video_codec_name.toUpperCase()} → **${args.inputFileObj.video_codec_name.toUpperCase()}**\n**Bit Depth:** ${originalVideoBitDepth}bit → **${currentVideoBitDepth}bit**`,
                    inline: false
                },
                {
                    name: '🎵 Audio Streams',
                    value: `**Original:** ${originalFileAudioStreams.join(', ')}\n**New:** ${currentFileAudioStreams.join(', ')}`,
                    inline: false
                },
                {
                    name: '💾 File Size',
                    value: `**Original:** ${formatFileSize(originalFileSizeInMB)}\n**New:** ${formatFileSize(currentFileSizeInMB)}\n**Saved:** ${formatFileSize(spaceSavedInMB)} (${spaceSavedPercentage.toFixed(2)}%)\n**New file is ${newFilePercentageOfOriginal.toFixed(2)}% of original**`,
                    inline: false
                },
                {
                    name: '⏱️ Processing Time',
                    value: `**Duration:** ${duration}`,
                    inline: false
                },
                {
                    name: '📝 New Filename',
                    value: `\`${newFilename}\``,
                    inline: false
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'DeNiX Transcoding Pipeline'
            }
        };

        logger.success('Discord embed built successfully');
        logger.debug(`Embed contains ${embed.fields.length} fields`);

        // ===============================================
        // STEP 3: SEND DISCORD NOTIFICATION
        // ===============================================
        
        logger.subsection('Step 3: Sending Discord notification');

        try {
            const response = yield fetch(new URL(discordUrl), {
                body: JSON.stringify({
                    embeds: [embed]
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            if (response.ok) {
                logger.success('Discord notification sent successfully');
                logger.extended(`HTTP Status: ${response.status} ${response.statusText}`);
            } else {
                logger.error(`Discord notification failed with HTTP ${response.status}`);
                logger.error(`Response: ${response.statusText}`);
            }

        } catch (error) {
            logger.error(`Discord notification failed: ${error.message}`);
            if (error.stack) {
                logger.debug(`Stack trace: ${error.stack}`);
            }
        }

        // Performance metrics
        const totalTime = Date.now() - startTime;
        if (args.inputs.logging_level === 'extended' || args.inputs.logging_level === 'debug') {
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️  Total processing: ${totalTime}ms`);
        }

        logger.success('✅ Notification sent - Pipeline complete');
        logger.info('=== End of Discord Notification ===');

        args.jobLog(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
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
            outputNumber: 1,
            variables: args.variables,
        };
    }
});

exports.plugin = plugin;