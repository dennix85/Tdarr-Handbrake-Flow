# DeNiX Enhanced Tdarr Plugins

## 🎯 Transform Your Media Processing Forever

Tired of basic Tdarr plugins that barely scratch the surface? Ready to unlock the **true potential** of your media library? 

Welcome to the **DeNiX Enhanced Plugin Collection** - where ordinary media processing becomes extraordinary.

## 💝 A Labor of Love (And Countless Coffee-Fueled Nights)

This isn't just another plugin pack. This is **hundreds of hours** of passionate development, testing, and optimization - all crafted in my spare time because I believe your media deserves better.

Every line of code represents late-night debugging sessions, weekend research marathons, and an obsessive drive to create tools that actually **work the way they should**. While I can't promise delivery dates (real life has a way of interfering!), I can promise unwavering dedication to keeping this project alive and evolving.

**Here's the reality:** If these plugins save you even a few hours of frustration, streamline workflows that used to make you want to pull your hair out, or simply work when everything else fails - then those countless nights were worth every minute.

Your support doesn't just help cover server costs or buy coffee (though both are appreciated!) - it validates that creating quality tools for the community matters. Even the smallest contribution tells me that what I'm building has real value for real people.

**💖 [Show Your Appreciation via PayPal](https://paypal.me/denixbug)** 

*Every dollar, every "thank you," every success story shared - it all fuels the next breakthrough.*

## 🚀 What Makes These Plugins Special

These aren't just ordinary Tdarr plugins - they're a complete game-changer for your media processing workflow:

- **🧠 Intelligent Processing**: Advanced detection algorithms that actually understand your media
- **💪 Rock-Solid Reliability**: Comprehensive error handling that won't leave you hanging
- **⚡ Performance Focused**: Optimized for speed without compromising quality
- **🎯 User-Centric Design**: Detailed logging and progress tracking so you always know what's happening
- **🌐 Universal Compatibility**: Works seamlessly across Windows, Linux, and Docker environments
- **🎬 Cutting-Edge Support**: Full Dolby Vision, HDR10+, and next-gen codec handling

## 📋 Plugin Collection

### Core System Plugins

#### 🖥️ OS & Docker Detection
**File**: `DeNiX_Enhanced_OS_Docker_Detection.js`
- Advanced OS and container detection with intelligent routing
- Comprehensive environment analysis and smart platform identification
- Routes to platform-specific outputs: Windows (1), Linux (2), macOS (3), Docker (4), Unknown (5)

#### 🚀 Enhanced Input File
**File**: `DeNiX_Enhanced_Input_File.js`
- Enhanced input file plugin with comprehensive file analysis
- Advanced access validation and detailed system reporting
- Quality assurance checks with environment-aware processing

### Media Analysis Plugins

#### 🎬 Video Codec Detection
**File**: `DeNiX_Enhanced_Video_Codec_Detection.js`
- Comprehensive video codec detection with intelligent routing
- Routes to codec-specific outputs: AV1 (1), VVC/H.266 (2), HEVC/H.265 (3), Other (4)
- Advanced stream analysis and performance monitoring

#### 🌈 HDR Detection
**File**: `HDR_Detection_Plugin.js`
- Advanced HDR content detection including Dolby Vision, HDR10, HLG
- Supports multiple detection methods and comprehensive property analysis
- Configurable property matching with debug logging

#### 🎵 Universal Audio to Opus Converter
**File**: `DeNiX_Universal_Audio_to_Opus.js`
- Intelligent audio transcoding to Opus format
- Multi-channel support with bitrate optimization
- Commentary track handling and quality-based processing

#### 🧹 Audio Stream Cleaner
**File**: `DeNiX_Audio_Stream_Cleaner.js`
- Advanced audio stream management and cleanup
- Quality-based stream selection and duplicate removal
- Minimum bitrate filtering and comprehensive reporting

### Utility Plugins

#### 🛠️ Enhanced MKVPropEdit
**File**: `DeNiX_Enhanced_MKVPropEdit.js`
- Advanced MKV metadata editing capabilities
- Enhanced error handling and comprehensive logging
- Detailed processing metrics and validation

#### 🔄 Classic Plugin Runner
**File**: `Run_Classic_Transcode_Plugin.js`
- Execute legacy Tdarr plugins with enhanced functionality
- Improved error handling and compatibility layer
- Support for classic plugin integration

## 🛠️ Installation

### Prerequisites

#### Required External Tools (Manual Installation)
These tools must be installed separately and configured in your Tdarr node settings:

- **FFmpeg** - Required for media processing operations
- **MediaInfo** - Required for detailed media analysis  
- **HandBrakeCLI** - Required for media processing operations

**Important**: After installing these tools, you must configure the paths to these binaries in your Tdarr node configuration settings.

### Plugin Installation

#### Option 1: DeNiX Docker Container (Recommended)

```bash
# Pull the revolutionary DeNiX container with full bare metal functionality
docker pull denix811/tdarr-denix:latest

# This container provides the ENVIRONMENT with all required tools:
# ✅ FFmpeg (latest with all codec support)
# ✅ MediaInfo (CLI and library)
# ✅ HandBrakeCLI (optimized)
# ✅ libdovi (Dolby Vision support)
# ✅ All dependencies for DeNiX Enhanced Plugins
```

**Then install the plugins:**
1. **Download the plugins** from this repository
2. **Copy plugin files** to your Tdarr plugins directory:
   ```
   server\Tdarr\Plugins\FlowPlugins\LocalFlowPlugins\denix
   ```
3. **Restart Tdarr server** to load the new plugins

**Why Choose This Container:**
- **Zero Tool Setup**: All binaries and libraries pre-installed
- **Full Functionality**: True bare metal performance in Docker
- **Complete Support**: Dolby Vision + HDR10+ processing without limitations
- **Perfect Environment**: Optimized runtime for DeNiX Enhanced Plugins

#### Option 2: Manual Installation

1. **Download the plugins** from this repository
2. **Copy plugin files** to your Tdarr plugins directory:
   ```
   server\Tdarr\Plugins\FlowPlugins\LocalFlowPlugins\denix
   ```
   (Create the `LocalFlowPlugins` folder if it doesn't exist)
3. **Install required tools manually**:
   - FFmpeg
   - MediaInfo  
   - HandBrakeCLI
4. **Configure tool paths** in your Tdarr node settings
5. **Restart Tdarr server** to load the new plugins

## 📥 Pre-Built Flows

To make getting started easier, I provide pre-configured flows for immediate use:

### Current Flow (Recommended)
<img width="757" height="725" alt="image" src="https://github.com/user-attachments/assets/60bc614a-3280-4be5-8c94-d41c07ef673e" />

**Latest Maintained Flow:**
- ✅ **Actively Maintained**: Regular updates and improvements
- ✅ **Full Feature Support**: Utilizes all latest plugin enhancements
- ✅ **Optimized Performance**: Best practices and efficient routing
- ✅ **Complete Documentation**: Comprehensive setup and usage guidance

### Legacy Flows

**Deprecated Flows (Still Functional):**
- ⚠️ **No Longer Maintained**: Will not receive updates or improvements
- ✅ **Still Work**: Functional but may lack newer features
- 🔄 **Migration Recommended**: Consider upgrading to the latest flow
- 📚 **Reference Only**: Good for understanding older implementations

### How to Use Flows

**Import Process:**
1. **Download** the latest flow file from this repository
2. **Open Tdarr** and go to the Flows tab
3. **Click "Import Flow"** and select the downloaded `.json` file
4. **Review settings** and adjust paths for your environment
5. **Test thoroughly** before production use

**Recommendations:**
- **Use Latest Flow**: Always prefer the current maintained version
- **Backup Settings**: Export your existing flows before importing new ones
- **Test First**: Validate with sample files before processing your library
- **Monitor Performance**: Check logs for optimal operation

## 📖 Usage Guide

### Quick Start with Pre-Built Flows

**Easiest way to get started:**
1. **Download flow files** from this repository
2. **Import into Tdarr** via the Flows tab → "Import Flow"
3. **Review settings** and adjust paths if needed
4. **Test with sample files** before production use

### Custom Flow Creation

1. **Create a new flow** in Tdarr
2. **Add plugins** from the DeNiX Enhanced collection
3. **Configure inputs** according to your requirements
4. **Set up routing** based on plugin outputs
5. **Test with sample files** before production use

### Recommended Flow Structure

```
Input File → OS Detection → Codec Detection → Processing → Output
     ↓              ↓             ↓              ↓         ↓
Enhanced Input → Platform    → Video Codec → Audio     → Final
Validation      Routing       Analysis      Processing   Output
```

### Platform-Specific Considerations

#### Windows
- Full feature support with all plugins
- Native tool integration and optimal performance
- Recommended for production environments

#### Linux
- Complete compatibility and excellent performance
- Preferred platform for server deployments
- Full Docker support available

#### Docker
- 🐳 **DeNiX Docker Container**: [denix811/tdarr-denix](https://hub.docker.com/r/denix811/tdarr-denix)
- ✅ **Full Dolby Vision Support**: Complete libdovi library integration
- ✅ **HDR10+ Support**: Full HDR processing capabilities
- ✅ **Bare Metal Performance**: Functions as a bare metal node without typical Docker limitations
- 🚧 **Active Development**: Some plugins may still be in development phase

## 🐳 DeNiX Revolutionary Docker Container

I've created a groundbreaking Docker container that **eliminates traditional Docker limitations** while providing full bare metal functionality:

**Container Details:**
- **Docker Hub**: [denix811/tdarr-denix](https://hub.docker.com/r/denix811/tdarr-denix)
- **Revolutionary**: Functions as a true bare metal node in Docker
- **Complete**: Full Dolby Vision + HDR10+ support with libdovi integration
- **Status**: 🚧 Some plugins still in optimization phase

### Key Advantages

**🎬 Full Media Processing Support:**
- ✅ **Dolby Vision**: Complete libdovi library - NO metadata stripping
- ✅ **HDR10+**: Full HDR processing capabilities
- ✅ **All Codecs**: AV1, VVC/H.266, HEVC/H.265 with full support

**🛠️ Complete Runtime Environment:**
- ✅ **FFmpeg**: Latest version with all codec support
- ✅ **MediaInfo**: Full CLI and library support
- ✅ **HandBrakeCLI**: Pre-installed and optimized
- ✅ **All Dependencies**: libdovi and system libraries included
- 📁 **Plugin Installation**: Users install plugins separately as needed

**⚡ Bare Metal Performance:**
- No typical Docker processing limitations
- Full system access where needed
- Optimized for DeNiX Enhanced Plugins

### Using the DeNiX Container

```bash
# Pull the revolutionary container
docker pull denix811/tdarr-denix:latest

# This container includes everything needed - no manual tool installation required!
```

### Why This Container is Revolutionary

Traditional Docker containers for Tdarr suffer from:
- ❌ Dolby Vision metadata stripping
- ❌ Missing system tools and libraries
- ❌ Performance limitations

**The DeNiX container solves ALL of these issues**, providing the complete runtime environment with all necessary binaries and libraries. Users simply need to install the plugins they want to use.

## ⚙️ Configuration

### Common Input Parameters

Most plugins share these configuration options:

- **Debug Logging**: Enable detailed logging for troubleshooting
- **File Access Checks**: Comprehensive validation of file permissions
- **Custom Tool Paths**: Specify paths to FFmpeg, MediaInfo, etc.
- **Processing Options**: Various codec and quality settings

### Output Routing

Plugins use numbered outputs for intelligent routing:

- **Output 1**: Success/Continue processing
- **Output 2**: Skip/No changes needed  
- **Output 3**: Error/Manual intervention required
- **Additional outputs**: Plugin-specific routing (codec types, etc.)

## 🐛 Troubleshooting

### Common Issues

#### Plugin Not Loading
- Verify Tdarr version compatibility (2.11.01+)
- Check plugin file location and permissions
- Review Tdarr server logs for errors

#### Processing Failures
- Enable debug logging in plugin settings
- Verify tool paths (FFmpeg, MediaInfo)
- Check file permissions and access rights

**DeNiX Docker Container Advantages:**
- 🐳 **Revolutionary Approach**: [denix811/tdarr-denix](https://hub.docker.com/r/denix811/tdarr-denix)
- ✅ **Full Dolby Vision Support**: Complete libdovi library integration - no metadata stripping!
- ✅ **HDR10+ Processing**: Full HDR capabilities without limitations
- ✅ **Bare Metal Functionality**: Container operates without typical Docker restrictions
- ✅ **Enhanced Tool Support**: All required tools pre-installed and optimized
- 🚧 **Development Status**: Some plugins may still be in optimization phase

**Why This Container is Different:**
Unlike traditional Docker containers that strip Dolby Vision metadata and have tool limitations, the DeNiX container provides full bare metal functionality in a containerized environment.

**Recommendations:**
- **Preferred Option**: Use denix811/tdarr-denix for Docker deployments
- **Full Support**: All DeNiX Enhanced Plugins designed to work optimally in this container
- **No Compromises**: Enjoy bare metal performance with Docker convenience

### Getting Help

1. **Enable debug logging** in plugin settings
2. **Check Tdarr logs** for detailed error information
3. **Verify system requirements** and tool availability
4. **Test with known good files** to isolate issues

## 📞 Support

- **Discord Support**: [Help & Support Channel](https://discord.com/channels/623392507828371476/1353809945568612526) - Primary support channel for questions, troubleshooting, and bug reports
- **Documentation**: Check this README and plugin tooltips for guidance
- **Community**: Participate in Tdarr community discussions

## 🔄 Version History & Roadmap

### Current Release
- Enhanced error handling and logging
- Improved cross-platform compatibility
- Advanced codec detection capabilities
- Comprehensive documentation updates
- **NEW**: Custom Docker container for improved plugin support

### Recent Developments
- 🐳 **DeNiX Docker Container**: Custom-built container addressing Docker limitations
- 🔧 **Enhanced MediaInfo Integration**: Improved media analysis capabilities
- 🌐 **Cross-Platform Detection**: Advanced OS and environment identification
- 📊 **Better Logging**: More detailed and helpful plugin output

### Future Plans
- Additional codec support (AV1, VVC/H.266 improvements)
- Performance optimizations for large media libraries
- Enhanced Docker container with more tool support
- New utility plugins based on community feedback
- Improved Dolby Vision handling in containerized environments

## 🙏 Acknowledgments

- **Tdarr Community**: For the excellent media management platform
- **FFmpeg Project**: For powerful media processing capabilities
- **MediaInfo**: For comprehensive media analysis tools
- **Contributors**: Everyone who helps improve these plugins

---

**Note**: Always test plugins in a safe environment before production use.
