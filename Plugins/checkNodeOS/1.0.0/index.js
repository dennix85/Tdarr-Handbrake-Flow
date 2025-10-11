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
    name: '🖥️ DeNiX Enhanced OS & Docker Detection: Intelligent Platform Routing',
    description: 'Advanced OS and container detection with intelligent routing, comprehensive environment analysis, and smart platform identification. Supports custom DeNiX containers for optimized processing. Routes to platform-specific outputs: Windows (1), Linux (2), macOS (3), Docker (4), Unknown (5).',
    style: {
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: '2px',
        borderStyle: 'solid',
        boxShadow: `
            0 0 10px rgba(85, 139, 47, 0.5),
            0 0 25px rgba(85, 139, 47, 0.46),
            0 0 40px rgba(85, 139, 47, 0.42),
            0 0 55px rgba(85, 139, 47, 0.39),
            0 0 70px rgba(85, 139, 47, 0.35),
            0 0 85px rgba(85, 139, 47, 0.31),
            0 0 100px rgba(85, 139, 47, 0.27),
            0 0 115px rgba(85, 139, 47, 0.23),
            0 0 130px rgba(85, 139, 47, 0.19),
            0 0 145px rgba(85, 139, 47, 0.17),
            0 0 160px rgba(85, 139, 47, 0.15),
            inset 0 0 20px rgba(85, 139, 47, 0.4)
        `,
        background: 'linear-gradient(45deg, rgba(85, 139, 47, 0.1), rgba(107, 142, 35, 0.1))',
    },
    tags: 'conditional,os,docker,platform,routing,enhanced,denix',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '🖥️',
    inputs: [
        {
            label: '🔍 Enable OS Detection Logging',
            name: 'enableDetectionLogging',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable detailed logging of OS and container detection processes',
        },
        {
            label: '🐳 Enable Docker Detection',
            name: 'enableDockerDetection',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Enable Docker/container environment detection with multiple methods',
        },
        {
            label: '💻 Include System Information',
            name: 'includeSystemInfo',
            type: 'boolean',
            defaultValue: true,
            inputUI: { type: 'switch' },
            tooltip: 'Include detailed system information in logs and variables (CPU, memory, architecture)',
        },
        {
            label: '⚡ Force Platform Override',
            name: 'forcePlatformOverride',
            type: 'string',
            defaultValue: 'auto',
            inputUI: {
                type: 'dropdown',
                options: [
                    'auto',
                    'windows',
                    'linux',
                    'darwin',
                    'docker',
                ],
            },
            tooltip: 'Override platform detection for testing. Use "auto" for normal operation.',
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
            tooltip: '🪟 Windows detected - Continue to Windows-specific processing',
        },
        {
            number: 2,
            tooltip: '🐧 Linux detected - Continue to Linux-specific processing',
        },
        {
            number: 3,
            tooltip: '🍎 macOS detected - Continue to macOS-specific processing',
        },
        {
            number: 4,
            tooltip: '🐳 Docker container detected - Continue to Docker-specific processing',
        },
        {
            number: 5,
            tooltip: '❓ Unknown OS detected - Handle unsupported platforms or errors',
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

// Format bytes helper
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Format uptime helper
const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
};

// Get comprehensive system information
const getSystemInformation = () => {
    const os = require('os');
    const fs = require('fs');
    
    const systemInfo = {
        // Basic OS information
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        type: os.type(),
        version: os.version ? os.version() : 'N/A',
        
        // System resources
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        cpus: os.cpus(),
        
        // Process information
        nodeVersion: process.version,
        pid: process.pid,
        ppid: process.ppid,
        cwd: process.cwd(),
        
        // Environment
        env: {
            NODE_ENV: process.env.NODE_ENV || 'unknown',
            HOME: process.env.HOME || process.env.USERPROFILE || 'unknown',
            USER: process.env.USER || process.env.USERNAME || 'unknown',
            SHELL: process.env.SHELL || 'unknown'
        }
    };
    
    // Try to get Linux distribution info
    try {
        if (fs.existsSync('/etc/os-release')) {
            const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
            const match = osRelease.match(/PRETTY_NAME="([^"]+)"/);
            systemInfo.linuxDistro = match?.[1] || 'Unknown Linux';
        }
        
        if (fs.existsSync('/proc/version')) {
            const version = fs.readFileSync('/proc/version', 'utf8').trim();
            systemInfo.kernelVersion = version.substring(0, 100); // Limit length
        }
    } catch (error) {
        // Silent fail for non-Linux systems or permission issues
    }
    
    return systemInfo;
};

// Enhanced Docker detection with DeNiX custom container support
const detectDockerEnvironment = (logger) => {
    const fs = require('fs');
    const detectionResult = {
        isDocker: false,
        containerType: 'none',
        detectionMethods: [],
        confidence: 'low',
        details: {}
    };
    
    logger.debug('Starting Docker environment detection');
    
    try {
        // PRIORITY METHOD: Check for custom DeNiX container marker (silent detection)
        if (fs.existsSync('/.denixscontainer')) {
            detectionResult.isDocker = true;
            detectionResult.containerType = 'denix_custom';
            detectionResult.detectionMethods.push('custom_marker');
            detectionResult.confidence = 'high';
            detectionResult.details.isDeNiXContainer = true;
            // NO LOGGING - keep detection mechanism private
        }
        
        // Method 1: Check for .dockerenv file (most reliable for Docker)
        if (fs.existsSync('/.dockerenv')) {
            detectionResult.isDocker = true;
            if (detectionResult.containerType === 'none') {
                detectionResult.containerType = 'docker';
            }
            detectionResult.detectionMethods.push('dockerenv_file');
            detectionResult.confidence = 'high';
            detectionResult.details.dockerenvExists = true;
            logger.debug('✅ /.dockerenv file found - Docker confirmed');
        } else {
            detectionResult.details.dockerenvExists = false;
            logger.debug('❌ /.dockerenv file not found');
        }
        
        // Method 2: Check cgroup for container signatures - IMPROVED LOGIC
        if (fs.existsSync('/proc/1/cgroup')) {
            const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
            detectionResult.details.cgroupSample = cgroup.substring(0, 150);
            
            // Check for LXC first (takes priority over general container detection)
            if (cgroup.includes('/lxc/') || cgroup.includes('lxc.payload')) {
                logger.debug('✅ LXC container detected - NOT Docker');
                detectionResult.details.isLXC = true;
                // Don't set isDocker = true for LXC (unless it's a DeNiX custom container)
                if (detectionResult.containerType !== 'denix_custom') {
                    detectionResult.isDocker = false;
                }
            } else {
                // Only check for other container types if it's not LXC
                const containerSignatures = [
                    { pattern: 'docker', type: 'docker' },
                    { pattern: 'containerd', type: 'containerd' },
                    { pattern: 'kubepods', type: 'kubernetes' }
                ];
                
                for (const signature of containerSignatures) {
                    if (cgroup.includes(signature.pattern)) {
                        detectionResult.isDocker = true;
                        if (detectionResult.containerType === 'none') {
                            detectionResult.containerType = signature.type;
                        }
                        detectionResult.detectionMethods.push(`cgroup_${signature.type}`);
                        detectionResult.confidence = 'high';
                        logger.debug(`✅ Container signature found: ${signature.type}`);
                        break;
                    }
                }
            }
            
            if (!detectionResult.isDocker && !detectionResult.details.isLXC) {
                logger.debug('❌ No container signatures in cgroup');
            }
        } else {
            logger.debug('❌ /proc/1/cgroup not accessible');
        }
        
        // Method 3: Check container environment variables
        const containerEnvVars = [
            'DOCKER_CONTAINER',
            'CONTAINER',
            'KUBERNETES_SERVICE_HOST',
            'KUBERNETES_PORT',
            'TDARR_CONTAINER' // Specific to Tdarr containers
        ];
        
        const foundEnvVars = [];
        containerEnvVars.forEach(envVar => {
            if (process.env[envVar]) {
                foundEnvVars.push(envVar);
                detectionResult.isDocker = true;
                detectionResult.detectionMethods.push(`env_${envVar.toLowerCase()}`);
                
                if (detectionResult.containerType === 'none') {
                    if (envVar.startsWith('KUBERNETES')) {
                        detectionResult.containerType = 'kubernetes';
                    } else if (envVar === 'TDARR_CONTAINER') {
                        detectionResult.containerType = 'tdarr_docker';
                    } else {
                        detectionResult.containerType = 'docker';
                    }
                }
                
                detectionResult.confidence = 'medium';
                logger.debug(`✅ Container env var found: ${envVar}`);
            }
        });
        
        detectionResult.details.foundEnvVars = foundEnvVars;
        
        // Method 4: Check for container-specific filesystem markers - IMPROVED
        const containerMarkers = [
            { path: '/run/.containerenv', type: 'podman' },  // Podman specific
            { path: '/.dockerenv', type: 'docker' }          // Docker specific (already checked above)
        ];
        
        containerMarkers.forEach(marker => {
            if (fs.existsSync(marker.path)) {
                // Only set as Docker if it's specifically Docker markers
                if (marker.type === 'docker' || marker.type === 'podman') {
                    detectionResult.isDocker = true;
                    if (detectionResult.containerType === 'none') {
                        detectionResult.containerType = marker.type;
                    }
                    detectionResult.detectionMethods.push(`marker_${marker.type}`);
                    detectionResult.confidence = 'medium';
                    logger.debug(`✅ Container marker found: ${marker.path} (${marker.type})`);
                }
            }
        });
        
        // Additional check: LXC-specific detection
        if (fs.existsSync('/proc/1/environ')) {
            try {
                const environ = fs.readFileSync('/proc/1/environ', 'utf8');
                if (environ.includes('container=lxc')) {
                    logger.debug('✅ LXC environment detected via /proc/1/environ');
                    detectionResult.details.isLXC = true;
                    // Only override if it's not a DeNiX custom container
                    if (detectionResult.containerType !== 'denix_custom') {
                        detectionResult.isDocker = false;
                        detectionResult.containerType = 'lxc';
                        detectionResult.detectionMethods = ['lxc_environ'];
                        detectionResult.confidence = 'high';
                    }
                }
            } catch (error) {
                logger.debug('❌ Could not read /proc/1/environ');
            }
        }
        
    } catch (error) {
        detectionResult.details.error = error.message;
        logger.warn(`Docker detection error: ${error.message}`);
    }
    
    // Final confidence calculation
    if (detectionResult.detectionMethods.length > 1) {
        detectionResult.confidence = 'high';
    } else if (detectionResult.detectionMethods.length === 1) {
        detectionResult.confidence = 'medium';
    }
    
    // Final logging - UPDATED TO HANDLE DENIX CONTAINERS
    if (detectionResult.details.isDeNiXContainer) {
        logger.extended(`DeNiX custom container detected (confidence: ${detectionResult.confidence})`);
        logger.extended(`Container type: Custom optimized environment`);
    } else if (detectionResult.details.isLXC) {
        logger.extended(`LXC container detected: NOT routing to Docker output`);
        logger.extended(`Container type: LXC (Linux Container)`);
    } else if (detectionResult.isDocker) {
        logger.extended(`Docker detection result: DETECTED (confidence: ${detectionResult.confidence})`);
        logger.extended(`Container type: ${detectionResult.containerType}`);
        logger.extended(`Detection methods: ${detectionResult.detectionMethods.join(', ')}`);
    } else {
        logger.extended(`Docker detection result: NOT DETECTED (confidence: ${detectionResult.confidence})`);
    }
    
    return detectionResult;
};

// Smart platform detection with override support
const detectPlatform = (forceOverride, logger) => {
    const os = require('os');
    
    if (forceOverride !== 'auto') {
        logger.warn(`🔧 Platform override active: ${forceOverride}`);
        return {
            platform: forceOverride,
            isOverridden: true,
            originalPlatform: os.platform()
        };
    }
    
    const detectedPlatform = os.platform();
    logger.success(`🔍 Platform detected: ${detectedPlatform}`);
    
    return {
        platform: detectedPlatform,
        isOverridden: false,
        originalPlatform: detectedPlatform
    };
};

// Intelligent routing logic - CORRECTED
const determineRouting = (platformInfo, dockerInfo, logger) => {
    // Priority 1: DeNiX custom container (route to Linux output)
    if (dockerInfo.details && dockerInfo.details.isDeNiXContainer) {
        logger.info(`🎯 DeNiX custom container detected - routing to Linux output`);
        return {
            outputNumber: 2,
            routingReason: 'DeNiX custom container detected',
            environmentName: 'DeNiX Custom Container',
            environmentType: 'denix_container'
        };
    }
    
    // Priority 2: Check for LXC (treat as native Linux)
    if (dockerInfo.details && dockerInfo.details.isLXC) {
        logger.info(`🐧 LXC container detected - treating as native Linux environment`);
        return {
            outputNumber: 2,
            routingReason: 'LXC container (treated as Linux)',
            environmentName: 'Linux (LXC)',
            environmentType: 'lxc'
        };
    }
    
    // Priority 3: Docker takes priority over OS (for actual Docker containers)
    if (dockerInfo.isDocker) {
        logger.info(`🐳 Docker environment detected - routing to Docker output`);
        return {
            outputNumber: 4,
            routingReason: 'Docker container detected',
            environmentName: `Docker Container (${platformInfo.platform})`,
            environmentType: 'container'
        };
    }
    
    // OS-based routing for native systems
    const platformMap = {
        'win32': { output: 1, name: 'Windows', icon: '🪟' },
        'windows': { output: 1, name: 'Windows', icon: '🪟' },
        'linux': { output: 2, name: 'Linux', icon: '🐧' },
        'darwin': { output: 3, name: 'macOS', icon: '🍎' },
        'macos': { output: 3, name: 'macOS', icon: '🍎' }
    };
    
    const mapping = platformMap[platformInfo.platform.toLowerCase()];
    
    if (mapping) {
        logger.success(`${mapping.icon} ${mapping.name} detected - routing to output ${mapping.output}`);
        return {
            outputNumber: mapping.output,
            routingReason: `${mapping.name} OS detected`,
            environmentName: mapping.name,
            environmentType: 'native'
        };
    } else {
        logger.warn(`❓ Unknown platform: ${platformInfo.platform} - routing to unknown output`);
        return {
            outputNumber: 5,
            routingReason: 'Unknown platform',
            environmentName: `Unknown (${platformInfo.platform})`,
            environmentType: 'unknown'
        };
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
        let performanceTimer = null;
        
        if (args.inputs.showPerformanceMetrics) {
            performanceTimer = createTimer();
        }

        const processingMetrics = {
            platformDetectionTime: 0,
            dockerDetectionTime: 0,
            systemInfoTime: 0,
            routingTime: 0,
            totalTime: 0
        };

        // Extract inputs using destructuring
        const {
            enableDetectionLogging,
            enableDockerDetection,
            includeSystemInfo,
            forcePlatformOverride,
            logging_level,
            showPerformanceMetrics
        } = args.inputs;

        logger.section('DeNiX Enhanced OS & Docker Detection: Intelligent Platform Routing');

        // ===============================================
        // STEP 1: PLATFORM DETECTION
        // ===============================================
        
        logger.subsection('Step 1: Platform detection and analysis');
        const platformStartTime = Date.now();

        const platformInfo = detectPlatform(forcePlatformOverride, logger);
        
        if (enableDetectionLogging) {
            if (platformInfo.isOverridden) {
                logger.info(`🔧 Platform: ${platformInfo.platform} (overridden from ${platformInfo.originalPlatform})`);
            } else {
                logger.info(`🖥️ Platform: ${platformInfo.platform}`);
            }
        }

        processingMetrics.platformDetectionTime = Date.now() - platformStartTime;

        // ===============================================
        // STEP 2: DOCKER DETECTION
        // ===============================================
        
        let dockerInfo = { 
            isDocker: false, 
            containerType: 'none', 
            detectionMethods: [], 
            confidence: 'none' 
        };

        if (enableDockerDetection && forcePlatformOverride !== 'docker') {
            logger.subsection('Step 2: Docker environment detection');
            const dockerStartTime = Date.now();

            dockerInfo = detectDockerEnvironment(logger);
            
            if (enableDetectionLogging) {
                if (dockerInfo.details && dockerInfo.details.isDeNiXContainer) {
                    logger.success(`🎯 DeNiX custom container detected (confidence: ${dockerInfo.confidence})`);
                } else if (dockerInfo.details && dockerInfo.details.isLXC) {
                    logger.success(`🐧 LXC detected: ${dockerInfo.containerType} (confidence: ${dockerInfo.confidence})`);
                } else if (dockerInfo.isDocker) {
                    logger.success(`🐳 Docker detected: ${dockerInfo.containerType} (confidence: ${dockerInfo.confidence})`);
                } else {
                    logger.info('🖥️ Native environment detected (no containers)');
                }
            }

            processingMetrics.dockerDetectionTime = Date.now() - dockerStartTime;
        } else if (forcePlatformOverride === 'docker') {
            logger.subsection('Step 2: Docker override mode');
            dockerInfo = {
                isDocker: true,
                containerType: 'docker',
                detectionMethods: ['forced_override'],
                confidence: 'override'
            };
            logger.info('🔧 Docker environment forced via override');
        } else {
            logger.info('⏭️ Step 2: Docker detection disabled');
        }

        // ===============================================
        // STEP 3: SYSTEM INFORMATION COLLECTION
        // ===============================================
        
        let systemInfo = null;
        if (includeSystemInfo) {
            logger.subsection('Step 3: System information collection');
            const systemStartTime = Date.now();

            systemInfo = getSystemInformation();
            
            if (enableDetectionLogging) {
                logger.extended(`🏠 Hostname: ${systemInfo.hostname}`);
                logger.extended(`🗝️ Architecture: ${systemInfo.arch}`);
                logger.extended(`⚡ Node.js: ${systemInfo.nodeVersion}`);
                logger.extended(`🖥️ CPU Cores: ${systemInfo.cpus.length}`);
                logger.extended(`💾 Memory: ${formatBytes(systemInfo.freemem)} free / ${formatBytes(systemInfo.totalmem)} total`);
                logger.extended(`⏱️ Uptime: ${formatUptime(systemInfo.uptime)}`);
                
                if (systemInfo.linuxDistro && logging_level === 'debug') {
                    logger.debug(`🐧 Linux Distribution: ${systemInfo.linuxDistro}`);
                }
            }

            processingMetrics.systemInfoTime = Date.now() - systemStartTime;
        } else {
            logger.info('⏭️ Step 3: System information collection disabled');
        }

        // ===============================================
        // STEP 4: ROUTING DETERMINATION
        // ===============================================
        
        logger.subsection('Step 4: Routing determination and decision');
        const routingStartTime = Date.now();

        const routingInfo = determineRouting(platformInfo, dockerInfo, logger);
        
        if (enableDetectionLogging) {
            logger.success(`🎯 Final routing: Output ${routingInfo.outputNumber} (${routingInfo.routingReason})`);
            logger.info(`🏷️ Environment: ${routingInfo.environmentName}`);
            logger.info(`🔧 Type: ${routingInfo.environmentType}`);
        }

        processingMetrics.routingTime = Date.now() - routingStartTime;

        // ===============================================
        // STEP 5: FINAL PROCESSING AND RESULTS
        // ===============================================
        
        processingMetrics.totalTime = Date.now() - startTime;

        logger.subsection('Step 5: Processing summary and results');

        // Enhanced variables with comprehensive information
        const updatedVariables = {
            ...args.variables,
            
            // Platform information
            detected_platform: platformInfo.platform,
            platform_overridden: platformInfo.isOverridden,
            original_platform: platformInfo.originalPlatform,
            
            // Docker information
            is_docker: dockerInfo.isDocker,
            container_type: dockerInfo.containerType,
            docker_detection_methods: dockerInfo.detectionMethods.join(','),
            docker_confidence: dockerInfo.confidence,
            
            // LXC information
            is_lxc: dockerInfo.details && dockerInfo.details.isLXC ? true : false,
            
            // DeNiX custom container information
            is_denix_container: dockerInfo.details && dockerInfo.details.isDeNiXContainer ? true : false,
            
            // Routing information
            environment_name: routingInfo.environmentName,
            environment_type: routingInfo.environmentType,
            routing_reason: routingInfo.routingReason,
            
            // Detection metadata
            detection_timestamp: new Date().toISOString(),
            os_detection_processing_time: processingMetrics.totalTime
        };

        // Add system information to variables if collected
        if (systemInfo) {
            Object.assign(updatedVariables, {
                system_hostname: systemInfo.hostname,
                system_arch: systemInfo.arch,
                system_node_version: systemInfo.nodeVersion,
                system_cpu_cores: systemInfo.cpus.length,
                system_total_memory: formatBytes(systemInfo.totalmem),
                system_free_memory: formatBytes(systemInfo.freemem),
                system_uptime: formatUptime(systemInfo.uptime)
            });
            
            if (systemInfo.linuxDistro) {
                updatedVariables.linux_distribution = systemInfo.linuxDistro;
            }
        }

        // Performance metrics
        if (showPerformanceMetrics && performanceTimer) {
            const totalTime = performanceTimer.stop();
            logger.subsection('Performance Metrics');
            logger.extended(`⏱️ Platform detection: ${processingMetrics.platformDetectionTime}ms`);
            logger.extended(`⏱️ Docker detection: ${processingMetrics.dockerDetectionTime}ms`);
            logger.extended(`⏱️ System information: ${processingMetrics.systemInfoTime}ms`);
            logger.extended(`⏱️ Routing decision: ${processingMetrics.routingTime}ms`);
            logger.extended(`⏱️ Total processing: ${totalTime.toFixed(2)}ms`);
            
            const efficiency = totalTime > 0 ? Math.round((1000 / totalTime) * 100) / 100 : 0;
            logger.extended(`📈 Processing efficiency: ${efficiency} detections/second`);

            // Add performance metrics to variables
            Object.assign(updatedVariables, {
                os_detection_performance_metrics: {
                    platform_detection: processingMetrics.platformDetectionTime,
                    docker_detection: processingMetrics.dockerDetectionTime,
					system_info: processingMetrics.systemInfoTime,
                    routing: processingMetrics.routingTime,
                    total: Math.round(totalTime)
                }
            });
        }

        // Feature utilization summary
        if (logging_level === 'debug') {
            logger.subsection('Feature Utilization');
            const features = [
                { name: 'Platform detection', enabled: true },
                { name: 'Docker detection', enabled: enableDockerDetection },
                { name: 'System information', enabled: includeSystemInfo },
                { name: 'Detection logging', enabled: enableDetectionLogging },
                { name: 'Performance metrics', enabled: showPerformanceMetrics },
                { name: 'Platform override', enabled: platformInfo.isOverridden },
                { name: 'DeNiX container support', enabled: true }
            ];
            
            features.forEach(feature => {
                logger.debug(`${feature.enabled ? '✅' : '❌'} ${feature.name}: ${feature.enabled ? 'Enabled' : 'Disabled'}`);
            });
            
            logger.debug(`🔍 Docker detection methods: ${dockerInfo.detectionMethods.length}`);
            logger.debug(`📋 Variables created: ${Object.keys(updatedVariables).length}`);
        }

        // Processing completion
        logger.success('OS and Docker detection completed successfully');
        logger.success('✅ Enhanced Platform Detection complete!');
        logger.info(`🎯 Final result: ${routingInfo.environmentName} → Output ${routingInfo.outputNumber}`);
        logger.info('=== End of Enhanced OS & Docker Detection ===');

        // Output all logs
        args.jobLog(logger.getOutput());

        return {
            outputFileObj: args.inputFileObj,
            outputNumber: routingInfo.outputNumber,
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
            outputNumber: 5,
            variables: args.variables,
        };
    }
});

exports.plugin = plugin;