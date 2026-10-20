/**
 * build_articles.js
 * Generates the 19 new high-quality articles and updates data/posts.json & data/videos.json
 * Timeline: 2026-10-09 down to 2026-09-12 (latest on top)
 */

const fs = require('fs');
const path = require('path');

const newVideosData = [
  {
    id: "cnrVOFg8VR4",
    title: "StrykerOSS 6.5 Is INSANE! 🔥 Major Android Pentesting Update + New Linux Engine",
    description: "StrykerOSS 6.5 brings major updates to Android penetration testing: a new User Mode Linux engine, improved Wi-Fi driver support, updated chroot arsenal, tactical dashboard, and optimized rootless performance.",
    category: "Linux & System",
    date: "2026-10-09",
    youtubeUrl: "https://www.youtube.com/watch?v=cnrVOFg8VR4"
  },
  {
    id: "ZZ3fvXhUaFU",
    title: "FinalRecon: Find EVERYTHING About a Website! 🔥 | Kali Linux Web Recon Tool",
    description: "FinalRecon is a fast, modular Python-based web reconnaissance tool that automates WHOIS lookups, SSL inspection, DNS enumeration, subdomain discovery, directory scanning, and Wayback Machine scraping.",
    category: "OSINT & Recon",
    date: "2026-10-07",
    youtubeUrl: "https://www.youtube.com/watch?v=ZZ3fvXhUaFU"
  },
  {
    id: "nQUFyoOFg2E",
    title: "Kali NetHunter Pro on a Laptop?! 😱 Full Live USB Demo | Kali Linux 2026",
    description: "Watch Kali NetHunter Pro boot natively from a live USB drive on a standard laptop. Explore the touch-friendly Phosh desktop interface, pre-installed cybersecurity arsenals, USB Arsenal, and wireless auditing.",
    category: "Linux & System",
    date: "2026-10-01",
    youtubeUrl: "https://www.youtube.com/watch?v=nQUFyoOFg2E"
  },
  {
    id: "j739aDxeL8o",
    title: "Kali NetHunter Pro on PC?! 🤯 Install NetHunter Pro via USB",
    description: "Step-by-step walkthrough for installing Kali NetHunter Pro AMD64 on a PC or laptop using Balena Etcher to create a bootable live USB drive with full hardware driver integration.",
    category: "Linux & System",
    date: "2026-09-30",
    youtubeUrl: "https://www.youtube.com/watch?v=j739aDxeL8o"
  },
  {
    id: "22Pta7WZI3g",
    title: "ObscuraCam App Review 2026 🔒 Blur Faces in Photos & Videos | Privacy Tool",
    description: "Protect digital privacy with ObscuraCam from The Guardian Project. Automatically detect and blur faces, pixelate sensitive areas, mask identity, and scrub EXIF metadata from mobile photos and videos.",
    category: "Linux & System",
    date: "2026-09-29",
    youtubeUrl: "https://www.youtube.com/watch?v=22Pta7WZI3g"
  },
  {
    id: "YvKLfrUk40Q",
    title: "NetCut Android App Tutorial 🔥 Control WiFi Devices & Manage Bandwidth (Root Required)",
    description: "Explore NetCut on rooted Android to scan connected network devices, identify rogue clients, monitor bandwidth usage, inspect ARP table states, and safeguard your wireless network against unauthorized usage.",
    category: "Network & Wireless Attacks",
    date: "2026-09-28",
    youtubeUrl: "https://www.youtube.com/watch?v=YvKLfrUk40Q"
  },
  {
    id: "38hilApDDLk",
    title: "cSploit Android Tutorial: Network Pentesting on Rooted Android | cSploit Features & Setup",
    description: "Comprehensive guide to cSploit for rooted Android devices. Perform network mapping, port scanning, traceroute, Metasploit integration, packet forging, traffic sniffing, and MITM vulnerability assessment.",
    category: "Network & Wireless Attacks",
    date: "2026-09-27",
    youtubeUrl: "https://www.youtube.com/watch?v=38hilApDDLk"
  },
  {
    id: "xeU1NVnNXrc",
    title: "Kali NetHunter WPS Attacks on Android | OneShot & Pixie Dust WiFi Security Testing",
    description: "Learn how WPS auditing works on Android with Kali NetHunter. Test router resilience using OneShot and the Pixie Dust attack to evaluate WPS PIN vulnerabilities and weak nonce entropy without brute forcing.",
    category: "Network & Wireless Attacks",
    date: "2026-09-26",
    youtubeUrl: "https://www.youtube.com/watch?v=xeU1NVnNXrc"
  },
  {
    id: "oQYbz_987tg",
    title: "Intercepter-NG Android Tutorial: Network Sniffing & Wireshark Alternative",
    description: "Master mobile network packet sniffing with Intercepter-NG on rooted Android. Discover local active hosts, analyze unencrypted protocols, reconstruct communication sessions, and verify transport encryption.",
    category: "Network & Wireless Attacks",
    date: "2026-09-25",
    youtubeUrl: "https://www.youtube.com/watch?v=oQYbz_987tg"
  },
  {
    id: "m1uNAOmxPK4",
    title: "LineageOS TV Android 16 on Raspberry Pi 3, 4 & 5 | First Boot & Setup Guide (Part 2)",
    description: "Part 2 of the LineageOS TV guide: first boot on Raspberry Pi, display configuration, audio setup, remote control pairing, USB peripheral support, and performance optimization for Android TV 16.",
    category: "Linux & System",
    date: "2026-09-24",
    youtubeUrl: "https://www.youtube.com/watch?v=m1uNAOmxPK4"
  },
  {
    id: "68FaAh6ECbg",
    title: "NFC Card Emulator Pro (Root) Tutorial | Emulate NFC Cards on Android + CUID & LSPosed",
    description: "Learn how to emulate supported 13.56MHz NFC/IC access cards on a rooted Android device using NFC Card Emulator Pro, LSPosed framework hooks, and CUID tag writing for physical access testing.",
    category: "Ethical Hacking & Tools",
    date: "2026-09-23",
    youtubeUrl: "https://www.youtube.com/watch?v=68FaAh6ECbg"
  },
  {
    id: "9FIhL5uETTw",
    title: "USB Gadget Tool on Android: Fix Rucky Kernel Not Supported Without Custom Kernel!",
    description: "Fix the 'Kernel Not Supported' error in Rucky and NetHunter without flashing custom kernels! Use USB Gadget Tool and Linux ConfigFS to configure USB HID keyboard and mouse endpoints on stock rooted Android.",
    category: "Linux & System",
    date: "2026-09-20",
    youtubeUrl: "https://www.youtube.com/watch?v=9FIhL5uETTw"
  },
  {
    id: "ZeCr3aS48l4",
    title: "Trape OSINT Tool Explained 🔥 Track IP, Location & Sessions | Cybersecurity Tutorial",
    description: "Understand browser tracking and OSINT reconnaissance with Trape. Learn how websites expose digital footprints, IP geolocation, battery status, and active sessions, and how to defend your browser privacy.",
    category: "OSINT & Recon",
    date: "2026-09-18",
    youtubeUrl: "https://www.youtube.com/watch?v=ZeCr3aS48l4"
  },
  {
    id: "v18Va_C48-o",
    title: "Kali NetHunter 2026.2 In-Depth Guide | Complete Android Pentesting Toolkit Explained",
    description: "Deep dive into Kali NetHunter 2026.2 for Android. Explore the NetHunter app suite, chroot container management, KeX desktop interface, USB Arsenal, Wi-Fi monitor mode, Bluetooth auditing, and CARsenal.",
    category: "Linux & System",
    date: "2026-09-17",
    youtubeUrl: "https://www.youtube.com/watch?v=v18Va_C48-o"
  },
  {
    id: "DKGJQbYEwyA",
    title: "Install LineageOS TV on Raspberry Pi 3/4/5 | Android TV Setup Guide | Part 1",
    description: "Turn your Raspberry Pi 3, 4, or 5 into a powerful Android TV streaming box with LineageOS TV. Part 1 covers hardware requirements, firmware downloading, image flashing, and boot configuration.",
    category: "Linux & System",
    date: "2026-09-16",
    youtubeUrl: "https://www.youtube.com/watch?v=DKGJQbYEwyA"
  },
  {
    id: "KW6rqsZer8c",
    title: "Maigret OSINT Tool: Find Social Media Accounts by Username | Ethical OSINT Tutorial",
    description: "Discover social media profiles across thousands of platforms with Maigret. Learn command-line username enumeration, report generation, Tor proxy integration, and false-positive reduction.",
    category: "OSINT & Recon",
    date: "2026-09-15",
    youtubeUrl: "https://www.youtube.com/watch?v=KW6rqsZer8c"
  },
  {
    id: "7SUG9w9yTQQ",
    title: "Raspberry Pi OpenWRT Router Part 3: USB WiFi Adapter & Access Point Setup",
    description: "Expand your Raspberry Pi OpenWrt router in Part 3: install external USB Wi-Fi adapter drivers, configure a secondary high-speed wireless access point, set up WWAN client connections, and test throughput.",
    category: "Network & Wireless Attacks",
    date: "2026-09-14",
    youtubeUrl: "https://www.youtube.com/watch?v=7SUG9w9yTQQ"
  },
  {
    id: "ytDp1RpaM_M",
    title: "PixelKnot Tutorial: Hide Secret Messages Inside Images on Android 🔐",
    description: "Learn mobile steganography with PixelKnot on Android. Embed password-protected encrypted secret text inside standard image photos using the F5 steganography algorithm without altering image appearance.",
    category: "Ethical Hacking & Tools",
    date: "2026-09-13",
    youtubeUrl: "https://www.youtube.com/watch?v=ytDp1RpaM_M"
  },
  {
    id: "eMDmUlqELTU",
    title: "Tookie OSINT Tutorial: Find Digital Footprints & Usernames | OSINT Tool for Linux",
    description: "Learn how to use Tookie OSINT on Linux for username reconnaissance, digital footprint mapping, and public data collection, while understanding false positive filtering in ethical intelligence operations.",
    category: "OSINT & Recon",
    date: "2026-09-12",
    youtubeUrl: "https://www.youtube.com/watch?v=eMDmUlqELTU"
  }
];

module.exports = { newVideosData };
