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
    name: '📢 DeNiX Information & Compatibility Notice: Important Guidelines & Support Info',
    description: 'Essential information plugin providing comprehensive compatibility guidelines, platform support details, and important notices for DeNiX Enhanced Plugins. Please read carefully to ensure optimal experience and proper support.',
    style: {
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '8px',
        // Enhanced bright blue glow with 10 layers - expanded reach with graduated opacity
        boxShadow: `
            0 0 10px rgba(33, 150, 243, 0.5),
            0 0 25px rgba(33, 150, 243, 0.46),
            0 0 40px rgba(33, 150, 243, 0.42),
            0 0 55px rgba(33, 150, 243, 0.39),
            0 0 70px rgba(33, 150, 243, 0.35),
            0 0 85px rgba(33, 150, 243, 0.31),
            0 0 100px rgba(33, 150, 243, 0.27),
            0 0 115px rgba(33, 150, 243, 0.23),
            0 0 130px rgba(33, 150, 243, 0.19),
            0 0 145px rgba(33, 150, 243, 0.17),
            0 0 160px rgba(33, 150, 243, 0.15),
            inset 0 0 20px rgba(33, 150, 243, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(25, 118, 210, 0.1))',
    },
    tags: 'information,compatibility,support,notice,guidelines',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '📢',
    inputs: [
        {
            label: '📋 Information Display Level',
            name: 'displayLevel',
            type: 'string',
            defaultValue: 'standard',
            inputUI: {
                type: 'dropdown',
                options: [
                    'essential',
                    'standard',
                    'comprehensive',
                ],
            },
            tooltip: 'Choose information detail level: essential (key points), standard (recommended), comprehensive (full details)',
        },
        {
            label: '🖥️ Show Platform-Specific Info',
            name: 'showPlatformInfo',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Display platform-specific compatibility information and recommendations',
        },
        {
            label: '🐳 Show Docker Information',
            name: 'showDockerInfo',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Display Docker-specific limitations and recommendations',
        },
        {
            label: '🔗 Show Support Links',
            name: 'showSupportLinks',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Include Discord support channels and update information links',
        },
        {
            label: '⚡ Show Performance Tips',
            name: 'showPerformanceTips',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Display performance optimization tips and best practices',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: '✅ Continue to next plugin - Information displayed successfully',
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

    notice(message) {
        this.output.push(`📢 ${message}`);
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
// INFORMATION CONTENT GENERATORS
// ===============================================

// Generate essential information
const generateEssentialInfo = (logger) => {
    logger.banner('🚨 ESSENTIAL COMPATIBILITY INFORMATION 🚨');
    
    logger.notice('Welcome to DeNiX Enhanced Plugins! Please read these important guidelines:');
    logger.warn('🐳 DOCKER USERS: Limited support - Dolby Vision processing will be stripped!');
    logger.warn('🍎 macOS USERS: Limited testing capabilities - support may be limited');
    logger.warn('💪 ARM USERS: Self-support required - no testing devices available');
    logger.notice('📞 For support, please use Discord channels provided below');
};

// Generate platform-specific information
const generatePlatformInfo = (logger, displayLevel) => {
    logger.section('Platform Compatibility & Support Information');
    
    // Windows Support
    logger.subsection('🪟 Windows Users - Full Support Available');
    logger.success('✅ Complete feature support with all advanced capabilities');
    logger.success('✅ Native MediaInfo integration for optimal performance');
    logger.success('✅ Full Docker alternative support on bare metal/VM/LXC');
    
    if (displayLevel !== 'essential') {
        logger.info('Windows users enjoy the most comprehensive support with all features fully tested and optimized');
    }
    
    // Linux Support
    logger.subsection('🐧 Linux Users - Full Support Available');
    logger.success('✅ Complete feature support with excellent performance');
    logger.success('✅ Native MediaInfo integration and custom applications');
    logger.success('✅ Preferred platform for advanced media processing');
    
    if (displayLevel !== 'essential') {
        logger.info('Linux users have access to all features with optimal performance and stability');
    }
    
    // macOS Support
    logger.subsection('🍎 macOS Users - Limited Testing Support');
    logger.warn('⚠️ Support provided on best-effort basis due to testing limitations');
    logger.info('🔧 Most features should work, but comprehensive testing unavailable');
    logger.info('💝 macOS users are valued members of our community');
    
    if (displayLevel === 'comprehensive') {
        logger.notice('While we appreciate all our macOS users and welcome everyone regardless of their platform choice,');
        logger.notice('we currently lack dedicated macOS testing devices. This means some edge cases might not be');
        logger.notice('thoroughly tested. We encourage macOS users to report any issues they encounter.');
    }
    
    // ARM Architecture
    logger.subsection('💪 ARM Users - Community Self-Support');
    logger.info('🤝 ARM users are wonderful people and part of our community');
    logger.warn('⚠️ No dedicated ARM testing devices available for comprehensive testing');
    logger.notice('🌟 Community support encouraged - ARM users helping ARM users');
    
    if (displayLevel !== 'essential') {
        logger.info('ARM architecture users are encouraged to share experiences and help each other');
        logger.info('Most plugins should work, but specific ARM-related issues may require community solutions');
    }
};

// Generate Docker-specific information
const generateDockerInfo = (logger, displayLevel) => {
    logger.section('🐳 Docker Environment - Important Limitations');
    
    logger.banner('🚨 CRITICAL: DOLBY VISION LIMITATION 🚨');
    logger.error('❌ DOLBY VISION PROCESSING IN DOCKER WILL STRIP DOLBY VISION METADATA');
    logger.error('❌ Docker containers are missing libdovi library required for DV processing');
    logger.warn('⚠️ This is a fundamental Docker limitation that cannot be fixed in plugins');
    
    logger.subsection('🔧 Docker Technical Limitations');
    logger.warn('⚠️ Node.js MediaInfo module limitations in containerized environments');
    logger.warn('⚠️ Size restrictions preventing inclusion of all required tools');
    logger.warn('⚠️ Missing or outdated system tools compared to bare metal installations');
    logger.warn('⚠️ Limited access to custom applications and native libraries');
    
    if (displayLevel !== 'essential') {
        logger.subsection('🏗️ Recommended Docker Alternatives');
        logger.success('✅ Bare Metal Installation - Full feature support');
        logger.success('✅ Virtual Machine (VM) - Complete compatibility');
        logger.success('✅ Linux Container (LXC) - Near-native performance');
        logger.info('These alternatives provide access to all system tools and libraries');
    }
    
    logger.subsection('📋 Docker User Recommendations');
    logger.notice('🔄 Please use Deprecated Flows for Docker environments');
    logger.notice('🛠️ Contact the developer for Docker-specific updates when needed');
    logger.info('💝 Docker users are valued, but technical limitations require different approaches');
    
    if (displayLevel === 'comprehensive') {
        logger.notice('We understand that Docker is a popular deployment method, and we appreciate all users');
        logger.notice('regardless of their chosen platform. However, the containerized nature of Docker');
        logger.notice('introduces several technical challenges that are beyond our control to resolve:');
        logger.info('• Container isolation prevents access to system-level media libraries');
        logger.info('• Package size limitations in containerized environments');
        logger.info('• Dependency management complexities in multi-stage builds');
        logger.info('• Performance overhead in media processing workloads');
    }
};

// Generate support and update information
const generateSupportInfo = (logger, displayLevel) => {
    logger.section('📞 Support Channels & Important Links');
    
    logger.subsection('🆘 Getting Help & Support');
    logger.success('🔗 Main Support Thread:');
    logger.info('   https://discord.com/channels/623392507828371476/1353809945568612526');
    logger.notice('👆 Use this link for general support questions and troubleshooting');
    
    logger.subsection('🔄 Updates & Announcements');
    logger.success('🔗 Weekly Updates Thread:');
    logger.info('   https://discord.com/channels/623392507828371476/1332819192637947934');
    logger.notice('👆 Check this thread weekly for flow updates and plugin releases');
    
    if (displayLevel !== 'essential') {
        logger.subsection('📋 Support Guidelines');
        logger.info('✅ Check weekly update thread before reporting issues');
        logger.info('✅ Ensure you are using the latest plugin versions');
        logger.info('✅ Provide system information when requesting help');
        logger.warn('⚠️ Outdated plugin versions may not receive support');
    }
    
    if (displayLevel === 'comprehensive') {
        logger.subsection('🤝 Community Guidelines');
        logger.notice('Our community welcomes everyone regardless of:');
        logger.info('• Operating system choice (Windows, Linux, macOS)');
        logger.info('• Hardware architecture (x86, x64, ARM)');
        logger.info('• Deployment method (bare metal, VM, Docker, LXC)');
        logger.info('• Technical skill level (beginner to expert)');
        logger.info('• Personal identity or background');
        logger.success('🌈 Diversity makes our community stronger and more innovative');
    }
};

// Generate performance tips
const generatePerformanceTips = (logger, displayLevel) => {
    logger.section('⚡ Performance Optimization Tips');
    
    logger.subsection('🚀 Best Practices for Optimal Performance');
    logger.success('✅ Use bare metal or VM installations for best performance');
    logger.success('✅ Ensure MediaInfo is properly installed and accessible');
    logger.success('✅ Keep plugins updated to latest versions');
    logger.success('✅ Use appropriate logging levels (avoid debug in production)');
    
    if (displayLevel !== 'essential') {
        logger.subsection('🔧 System Optimization');
        logger.info('• Allocate sufficient RAM for media processing workloads');
        logger.info('• Use fast storage (SSD) for temporary processing files');
        logger.info('• Ensure network stability for library access');
        logger.info('• Monitor system resources during processing');
    }
    
    if (displayLevel === 'comprehensive') {
        logger.subsection('📊 Advanced Optimization');
        logger.info('• Configure appropriate worker thread limits');
        logger.info('• Use quality-based processing queues');
        logger.info('• Implement proper error handling and retry logic');
        logger.info('• Regular maintenance of processing queues');
        logger.info('• Monitor and analyze processing statistics');
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
        
        // Initialize logger with info level (always show all information)
        const logger = new Logger('info');

        // Extract inputs
        const {
            displayLevel,
            showPlatformInfo,
            showDockerInfo,
            showSupportLinks,
            showPerformanceTips
        } = args.inputs;

        logger.section('DeNiX Enhanced Plugins - Information & Compatibility Notice');
        logger.notice('Thank you for using DeNiX Enhanced Plugins!');
        logger.info(`Information level: ${displayLevel.toUpperCase()}`);

        // Generate essential information (always shown)
        generateEssentialInfo(logger);

        // Generate optional sections based on user preferences
        if (showPlatformInfo) {
            generatePlatformInfo(logger, displayLevel);
        }

        if (showDockerInfo) {
            generateDockerInfo(logger, displayLevel);
        }

        if (showSupportLinks) {
            generateSupportInfo(logger, displayLevel);
        }

        if (showPerformanceTips) {
            generatePerformanceTips(logger, displayLevel);
        }

        // Final message
        logger.section('🎯 Summary & Next Steps');
        logger.success('✅ Information display completed successfully');
        logger.notice('📖 Please take time to read and understand the guidelines above');
        logger.info('🔄 Proceeding to next plugin in flow...');
        
        if (displayLevel === 'essential') {
            logger.warn('💡 Consider using "standard" or "comprehensive" display level for more details');
        }

        logger.banner('🚀 READY TO PROCEED WITH ENHANCED PROCESSING 🚀');

        // Output all information to job log
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 1,
            variables: {
                ...args.variables,
                denix_info_displayed: true,
                denix_info_level: displayLevel,
                denix_info_timestamp: new Date().toISOString()
            },
        };

    } catch (error) {
        const logger = new Logger('info');
        logger.error(`Information plugin failed: ${error.message}`);
        args.jobLog(logger.getOutput());
        
        // Don't fail the flow for information display issues
        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 1,
            variables: args.variables,
        };
    }
});

exports.plugin = plugin;