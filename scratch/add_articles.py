import json

articles = [
  {
    "id": "mosint-email-osint-intelligence-kali-linux-tutorial",
    "title": "Mosint Tutorial: Email OSINT & Intelligence Gathering on Kali Linux",
    "excerpt": "Master Mosint — the automated email intelligence and reconnaissance framework. Learn Go installation on Kali Linux, API configurations (Hunter, HaveIBeenPwned, IntelX), breach discovery, and defense.",
    "category": "Social Engineering",
    "tags": ["Mosint", "OSINT", "Email-Intelligence", "Kali-Linux", "Reconnaissance"],
    "date": "2026-09-08",
    "author": "Ethical Explorers Team",
    "readTime": "9 min read",
    "image": "images/blog/mosint-email-osint.jpg",
    "featured": True,
    "youtubeId": "8rUnbUIc1Zg",
    "content": """**Mosint** is one of the most comprehensive automated email OSINT (Open Source Intelligence) reconnaissance frameworks engineered for cybersecurity professionals, threat hunters, and authorized penetration testers. Because an email address serves as the central identity anchor for online accounts, corporate directory services, password recovery flows, and cloud subscriptions, conducting passive email intelligence is a pivotal step during initial attack surface mapping.

In this deep dive based on our Ethical Explorers video tutorial, we explore how Mosint operates, how to install and build it using Go on Kali Linux or Ubuntu, configure critical API keys, perform automated multi-vector email scans, and deploy defensive hardening against digital profiling.

---

## Why Email OSINT Matters in Cyber Operations

An email address is rarely just a communication channel — in modern cybersecurity, it represents an immutable pivot point:
- **Spear-Phishing & Social Engineering:** Determining the target's corporate role, linked secondary accounts, and recent vendor communications to design ultra-convincing pretexts.
- **Credential Stuffing & Breach Correlation:** Checking whether target credentials surfaced in historic database breaches (Combo lists, Stealer logs, Dark Web dumps).
- **Attack Surface Enumeration:** Uncovering custom mail server domains, MX configurations, catch-all mailboxes, and misconfigured SPF/DMARC records vulnerable to spoofing.
- **Account Takeover & Identity Mapping:** Discovering which public services (GitHub, Spotify, Instagram, Twitter/X, Adobe) are associated with the target email address.

---

## Mosint Architecture & Capabilities

| Capability | Detection Method / Engine | Value to Analyst |
| :--- | :--- | :--- |
| **Mail Server Validation** | Direct SMTP Handshake & DNS MX Verification | Confirms inbox exists without sending an email |
| **Data Breach Checks** | HaveIBeenPwned, BreachDirectory, IntelX APIs | Identifies compromised passwords and historical exposure |
| **Social Footprint Mapping** | Service Enumeration & Gravatar Lookup | Links professional email to public social accounts |
| **Disposable Mail Detection** | Disposable Domain Database & Regex Filters | Flags temporary burner mailboxes used by threat actors |
| **Domain Security Audit** | DNS TXT & Policy Lookup | Evaluates SPF, DKIM, and DMARC enforcement |

---

## Step 1: Prerequisites & Go Installation on Kali Linux

Mosint is developed in Go (Golang), which ensures high concurrency and fast execution. First, ensure your Kali Linux or Debian-based distribution has the required Go environment configured:

```bash
# Update system repositories
sudo apt update && sudo apt upgrade -y

# Install Golang and Git
sudo apt install -y golang git

# Verify Go installation
go version
```

Make sure your Go workspace paths are added to your environment (`~/.bashrc` or `~/.zshrc`):

```bash
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin' >> ~/.bashrc
source ~/.bashrc
```

---

## Step 2: Clone & Build Mosint

Clone the official Mosint repository and compile the binary:

```bash
# 1. Clone repository
git clone https://github.com/alpkeskin/mosint.git
cd mosint

# 2. Build or install with Go
go install
# Alternatively, build local binary
go build -o mosint main.go

# 3. Verify Mosint help output
./mosint --help
```

---

## Step 3: Configuring API Keys for Maximum Intelligence

While Mosint can perform basic SMTP and DNS queries without API keys, integrating third-party OSINT services unlocks its full potential:

```bash
# Set up your configuration file
./mosint set <service> <api_key>
```

Recommended APIs to integrate:
- **Hunter.io:** Reveals company email patterns and professional association.
- **HaveIBeenPwned:** Authoritative database of known data breach dumps.
- **Emailrep.io:** Calculates reputation scores, spam likelihood, and account age.
- **Intelligence X (intelx.io):** Searches paste sites, dark web archives, and public leaks.
- **BreachDirectory:** Pinpoints leaked records and breach dates.

To configure your keys:
```bash
./mosint set hunter <YOUR_HUNTER_API_KEY>
./mosint set emailrep <YOUR_EMAILREP_API_KEY>
./mosint set intelx <YOUR_INTELX_API_KEY>
```

---

## Step 4: Executing Target Email Reconnaissance

### 1. Basic Single Target Scan
To execute a thorough OSINT scan against a specific address:

```bash
./mosint scan target@example.com
```

### 2. Output to Structured JSON / CSV
For integration into reporting pipelines or threat intelligence dashboards:

```bash
./mosint scan target@example.com --output json > report.json
```

### 3. Understanding the Scan Results:
- **SMTP Verification:** Validates that the mailbox physically exists on the remote exchange server.
- **Syntax & Disposable Status:** Confirms RFC compliance and ensures the domain isn't an ephemeral relay like TempMail or GuerrillaMail.
- **Breached Records:** Displays which specific breaches the account appeared in, giving immediate priority to credential rotation assessments.
- **Social Registrations:** Highlights whether the email is registered on major consumer platforms.

---

## Defensive Countermeasures: Mitigating Email OSINT Risks

Organizations and individuals can defend against automated OSINT profiling by following these security best practices:

1. **Enforce Strict DMARC & SPF:** Ensure your domain includes an enforced `v=DMARC1; p=reject;` policy and accurate SPF `ip4` includes to prevent attackers from spoofing your mailboxes.
2. **Implement Email Aliases:** Use masked relay services (such as SimpleLogin, Firefox Relay, or Apple Hide My Email) when signing up for non-critical third-party services.
3. **Monitor Credential Leaks Proactively:** Integrate corporate email domain monitoring with HaveIBeenPwned Enterprise or dark web threat feeds to detect compromised passwords before attackers exploit them.
4. **Disable Catch-All Mailboxes:** Misconfigured catch-all domains allow attackers to enumerate organizational directory conventions via dictionary probing.

Watch the complete video demonstration on the Ethical Explorers YouTube channel to see Mosint in action against real test targets!"""
  },
  {
    "id": "strykeross-turn-android-phone-into-pentesting-machine",
    "title": "StrykerOSS Guide: Turn Your Android Phone Into a Pentesting Machine",
    "excerpt": "Transform your Android smartphone into an ethical hacking and mobile penetration testing arsenal with StrykerOSS. Discover installation, Nmap network scanning, Metasploit payloads, and security audits.",
    "category": "Penetration Testing",
    "tags": ["StrykerOSS", "Android", "Mobile-Pentesting", "Metasploit", "Nmap"],
    "date": "2026-09-07",
    "author": "Ethical Explorers Team",
    "readTime": "10 min read",
    "image": "images/blog/strykeross-android-pentest.jpg",
    "featured": True,
    "youtubeId": "wBNfsbnIhrY",
    "content": """**StrykerOSS** is an open-source cybersecurity and mobile offensive security framework designed to transform any modern Android device into a compact, fully loaded penetration testing machine. While dedicated security hardware like Pwnagotchis or Wi-Fi Pineapples are effective, modern smartphones offer powerful octa-core processors, multi-gigabyte RAM pools, integrated LTE/Wi-Fi/Bluetooth antennas, and extreme physical portability.

In this practical guide based on our Ethical Explorers video tutorial, we review the architecture of StrykerOSS, explain how to set up the environment on Android, configure penetration testing utilities like Nmap and Metasploit, and execute physical network security assessments.

---

## The Rise of Mobile Penetration Testing

Physical penetration testing and covert red team engagements require low-profile equipment. Walking through a corporate facility or conducting wireless audits while operating a laptop immediately raises suspicion. In contrast:
- **Stealth & Discretion:** Interacting with an Android smartphone attracts zero attention in public or corporate lobbies.
- **All-in-One Radio Suite:** Built-in Wi-Fi, Bluetooth Low Energy (BLE), Cellular, and NFC hardware enable multi-protocol auditing.
- **Extended Battery Longevity:** Smartphones routinely operate for 8–14 hours under field conditions or can be indefinitely powered by pocket power banks.

---

## StrykerOSS Environment Overview

| Feature | Description | Red Team Utility |
| :--- | :--- | :--- |
| **Automated Toolchain** | Curated collection of pentest tools | Installs Nmap, Metasploit, SQLmap, Dirb, and custom scripts |
| **Modular Command Menu** | Interactive CLI interface | Allows rapid execution without memorizing complex command flags |
| **Network Recon Engine** | Fast local subnet scanning | Discovers live hosts, open ports, and vulnerable services |
| **Payload Delivery** | Automated listener and handler launchers | Rapidly spawns reverse shells and staging servers |

---

## Prerequisites & Android Environment Setup

StrykerOSS operates smoothly on standard Android smartphones (Android 9 through Android 15). The recommended foundation is **Termux** obtained from F-Droid (avoid Google Play versions as they are outdated due to API restrictions).

```bash
# 1. Update Termux base packages
pkg update && pkg upgrade -y

# 2. Grant Termux storage permissions
termux-setup-storage

# 3. Install core dependencies
pkg install -y git python python-pip curl wget nmap openssh
```

---

## Installing StrykerOSS on Android

With Termux initialized, clone the StrykerOSS repository and run the setup script:

```bash
# 1. Clone StrykerOSS repository
git clone https://github.com/ethicalexplorers/StrykerOSS.git
cd StrykerOSS

# 2. Grant executable permissions
chmod +x setup.sh stryker.py

# 3. Run installation wizard
./setup.sh
```

The installer verifies your architecture (arm64-v8a / armeabi-v7a), downloads necessary Python modules, and compiles native C/C++ helper libraries.

---

## Launching & Operating StrykerOSS

Start the interactive console:

```bash
python3 stryker.py
```

### 1. Network Reconnaissance with Nmap
From the Stryker menu, select Network Scanner:
```text
[1] Fast Local Subnet Ping Sweep
[2] Comprehensive TCP Port Scan
[3] Service Version & OS Fingerprinting
[4] Vulnerability Script Scan (--script vuln)
```
Executing Option 1 scans your local subnet (e.g., `192.168.1.0/24`) and outputs active IP addresses, hostnames, and MAC vendor fingerprints within seconds.

### 2. Metasploit Framework Integration
StrykerOSS enables one-touch payload generation and multi-handler listener deployment:
- Generates staged reverse TCP payloads for Windows, Linux, and Android testbeds.
- Spawns `msfconsole` with automated resource files (`.rc`) that preconfigure `LHOST`, `LPORT`, and exploit listeners.

```bash
# Deploy listener directly from terminal
msfconsole -r listeners/android_handler.rc
```

### 3. Web & Application Scanning
Integrates automated directory busting and injection testing:
- **Dirb / Gobuster:** Enumerates hidden admin portals, API endpoints, and sensitive directories.
- **SQLMap:** Automated detection and extraction of SQL injection vulnerabilities in web parameters.

---

## Real-World Red Team Field Use Case

During physical security assessments, an operator carrying an Android device running StrykerOSS can:
1. Connect to an accessible guest Wi-Fi network or plug in via a USB-C to Gigabit Ethernet dongle to a wall port in an unmonitored conference room.
2. Execute a quiet ARP ping sweep to map internal VLAN routing and discover dual-homed appliances (printers, VoIP phones, IP cameras).
3. Identify default credentials or unpatched vulnerabilities without exposing a conspicuous laptop screen.

---

## Defensive Countermeasures for Blue Teams

Security operations centers (SOCs) and network administrators can defend against mobile rogue devices:
1. **Enforce 802.1X Port Security:** Require enterprise certificates (EAP-TLS) on all physical wall jacks and corporate SSIDs to block unauthenticated mobile devices.
2. **Implement Rogue Device Detection:** Use Network Access Control (NAC) solutions (e.g., Cisco ISE, PacketFence) to profile connected hardware by MAC OUI and DHCP fingerprinting.
3. **Isolate Guest Networks:** Strictly isolate guest Wi-Fi networks with client isolation rules, preventing mobile devices from probing internal subnets.

Check out our full YouTube walkthrough for an in-depth video demonstration of StrykerOSS in action!"""
  },
  {
    "id": "install-openwrt-raspberry-pi-4-wifi-router-guide",
    "title": "How to Install OpenWrt on Raspberry Pi 4 & Turn It Into a WiFi Router (Part 1)",
    "excerpt": "Step-by-step guide to installing OpenWrt on Raspberry Pi 4B. Build a powerful custom router and firewall with USB Wi-Fi dongles, gigabit ethernet, LuCI web interface, and robust security rules.",
    "category": "Network Security",
    "tags": ["OpenWrt", "Raspberry-Pi-4", "WiFi-Router", "Network-Security", "Firewall"],
    "date": "2026-09-06",
    "author": "Ethical Explorers Team",
    "readTime": "12 min read",
    "image": "images/blog/openwrt-raspberry-pi.jpg",
    "featured": True,
    "youtubeId": "sexkWxBtAhY",
    "content": """**OpenWrt** is an open-source, Linux-based operating system designed for embedded network devices, providing full package management, custom routing tables, granular firewall policies, and enterprise-grade network security. While commercial off-the-shelf consumer routers frequently suffer from weak firmware, delayed security patches, and limited CPU performance, repurposing a **Raspberry Pi 4 Model B** into an OpenWrt router delivers incredible throughput, robust security filtering, and total control over your network traffic.

In this first part of our comprehensive OpenWrt series based on our Ethical Explorers video tutorial, we cover everything needed to get up and running: hardware selection, flashing firmware, initial connection, LuCI graphical interface setup, WAN/LAN interface configuration, and Wi-Fi access point deployment.

---

## Why Use a Raspberry Pi 4 as a Custom Router?

| Feature | Commercial ISP Router | Raspberry Pi 4 with OpenWrt |
| :--- | :--- | :--- |
| **CPU Processor** | Low-power single/dual-core MIPS | Quad-core ARM Cortex-A72 @ 1.5GHz / 1.8GHz |
| **RAM Memory** | 128MB – 512MB | 2GB, 4GB, or 8GB LPDDR4 |
| **Gigabit Throughput** | Often bottlenecks on VPN / SQM | Line-rate 1 Gbps wire-speed routing with ease |
| **Software Flexibility** | Closed proprietary firmware | Full Linux kernel with opkg package manager |
| **VPN & WireGuard Speeds** | 20–50 Mbps max (weak crypto engines) | 600+ Mbps hardware-accelerated WireGuard crypto |

---

## Required Hardware & Components

To build your Raspberry Pi 4 router, gather the following equipment:
1. **Raspberry Pi 4 Model B** (2GB RAM is plenty; 4GB or 8GB recommended if running AdGuard Home or Docker).
2. **Quality High-Endurance microSD Card** (16GB or 32GB Class 10 / A1) or a USB 3.0 SSD.
3. **Official 5.1V / 3.0A USB-C Power Supply** (stable power prevents kernel panics during high network loads).
4. **Active Cooling or Heavy Aluminum Case** (the Pi 4 CPU runs warm when processing high packet volumes).
5. **USB 3.0 to Gigabit Ethernet Adapter** (e.g., Realtek RTL8153 or ASIX AX88179 chipset) to serve as your dedicated WAN or LAN port.
6. **Optional USB Wi-Fi Dongle or Internal Wi-Fi** for Access Point (AP) broadcasting.

---

## Step 1: Download & Flash the OpenWrt Image

OpenWrt provides official pre-compiled images for the Raspberry Pi 4 ARM64 platform:

1. Visit the official OpenWrt firmware selector and choose **Raspberry Pi 4 Model B**.
2. Select the **ext4 factory image** (`openwrt-bcm27xx-bcm2711-rpi-4-ext4-factory.img.gz`).
3. Decompress the downloaded `.img.gz` file to obtain the raw `.img` disk image.
4. Launch **Raspberry Pi Imager** or **BalenaEtcher**:
   - Select the decompressed OpenWrt image.
   - Select your target microSD card.
   - Click **Write / Flash**.

---

## Step 2: First Boot & Network Connection

Once flashing completes, insert the microSD card into your Raspberry Pi 4, connect the onboard Gigabit Ethernet port directly to your laptop or PC with an Ethernet cable, and plug in the power supply.

```text
[Raspberry Pi 4 Onboard Eth0] <======== Ethernet Cable ========> [Your Computer]
```

By default, OpenWrt assigns `192.168.1.1` to the built-in Ethernet interface (`eth0`) and runs a local DHCP server:
1. Wait approximately 45–60 seconds for the kernel to boot.
2. Your computer will automatically receive an IP address in the `192.168.1.x` subnet (e.g., `192.168.1.150`).
3. Test connectivity by opening your terminal and pinging the Pi:

```bash
ping 192.168.1.1
```

---

## Step 3: Accessing OpenWrt Shell & Installing LuCI Web GUI

Open a terminal or SSH client and connect to OpenWrt as `root`:

```bash
ssh root@192.168.1.1
```

*(Note: Fresh OpenWrt installations have no default password. You will be prompted to set one immediately).*

To install the web interface (LuCI) if not bundled:
```bash
passwd
# Enter a strong root password

# Check network connectivity and install LuCI
opkg update
opkg install luci
/etc/init.d/uhttpd start
/etc/init.d/uhttpd enable
```

Now open your web browser and navigate to:
```text
http://192.168.1.1
```
Log in using `root` and your newly created administrative password.

---

## Step 4: Configuring WAN & LAN Interfaces

A router requires at least two separate network interfaces:
- **WAN (Wide Area Network):** Connects to your ISP modem/upstream gateway.
- **LAN (Local Area Network):** Connects to your local private switch, access points, and devices.

### Recommended Port Layout:
- **`eth0` (Built-in Port):** LAN interface (`192.168.1.1/24` with DHCP server enabled).
- **`eth1` (USB 3.0 Gigabit Adapter):** WAN interface (configured for DHCP client or PPPoE depending on your ISP).

To configure in LuCI:
1. Navigate to **Network** -> **Interfaces**.
2. Edit the **WAN** interface:
   - Device: Select `eth1` (your USB Ethernet adapter).
   - Protocol: `DHCP Client`.
   - Firewall Settings: Assign to the `wan` firewall zone.
3. Save & Apply changes. Plug your modem into `eth1` — your Pi 4 is now routing internet traffic!

---

## Step 5: Configuring the Wi-Fi Access Point (AP)

If using the Raspberry Pi 4's built-in Broadcom BCM43455 Wi-Fi chip or an external high-gain Wi-Fi dongle:

1. In LuCI, navigate to **Network** -> **Wireless**.
2. Click **Enable** on the radio interface (e.g., `radio0` for 2.4GHz or 5GHz).
3. Click **Edit** to configure the wireless network:
   - **Mode:** `Access Point (AP)`
   - **ESSID:** Enter your desired Wi-Fi network name (e.g., `EthicalExplorers_SecureNet`).
   - **Network:** Assign to the `lan` interface bridge (`br-lan`).
4. Switch to the **Wireless Security** tab:
   - **Encryption:** `WPA2-PSK / WPA3-SAE Mixed Mode` (or pure `WPA3-SAE` for maximum cryptographic protection).
   - **Key:** Enter a strong passphrase (minimum 16 characters).
5. Click **Save & Apply**. Devices can now connect wirelessly to your custom router!

---

## Network Hardening & Next Steps

With your basic OpenWrt router running, reinforce its defenses:
- **Disable Remote Management:** Ensure port 80/443 and SSH (port 22) are blocked from the WAN interface (enabled by default in OpenWrt firewall).
- **Set Up DNS Encryption:** Install `dnscrypt-proxy2` or `stubby` for DNS-over-HTTPS (DoH).
- **Network-Wide Ad Blocking:** Install `adblock-fast` or deploy an integrated `adguardhome` container.

Stay tuned for **Part 2**, where we configure advanced traffic shaping (SQM Cake) for zero bufferbloat, set up WireGuard site-to-site VPNs, and create isolated VLANs for IoT devices!"""
  },
  {
    "id": "kalidroid-run-full-kali-linux-android-without-root-guide",
    "title": "KaliDroid Tutorial: Run Full Kali Linux on Android Without Root (2026)",
    "excerpt": "Learn how to run full Kali Linux on any unrooted Android device using KaliDroid. Complete 2026 tutorial covering APK setup, Termux PRoot environment, VNC GUI desktop, and essential pentesting tools.",
    "category": "Penetration Testing",
    "tags": ["KaliDroid", "Kali-Linux", "Android", "Rootless", "Mobile-Security"],
    "date": "2026-09-05",
    "author": "Ethical Explorers Team",
    "readTime": "10 min read",
    "image": "images/blog/kalidroid-android-kali.jpg",
    "featured": True,
    "youtubeId": "eAs-9UCVZ8w",
    "content": """**KaliDroid** is a breakthrough rootless penetration testing solution that enables cybersecurity students, ethical hackers, and security analysts to deploy a full Kali Linux distribution on standard Android devices without voiding warranties, unlocking bootloaders, or triggering Knox/SafetyNet trips. By combining the power of **Termux**, Linux **PRoot** virtualization, and lightweight **XFCE4** graphical desktop streaming, KaliDroid delivers a complete ethical hacking suite directly into your pocket.

In this practical 2026 installation walkthrough based on our Ethical Explorers video tutorial, we show you step-by-step how to set up KaliDroid, initialize the Kali Linux core filesystem, access both command-line and graphical desktop interfaces, and deploy your favorite security tools.

---

## Why Rootless Penetration Testing on Android?

Traditional mobile pentesting setups (like Kali NetHunter) typically require an unlocked bootloader, custom recoveries (TWRP/OrangeFox), and Magisk root permissions. However, rootless configurations offer distinct advantages:

| Dimension | Rooted Kali NetHunter | Rootless KaliDroid |
| :--- | :--- | :--- |
| **Warranty & Device Integrity** | Voids manufacturer warranty, trips Knox/SafetyNet | 100% safe, no hardware modifications |
| **Banking & Enterprise Apps** | Often broken by root detection | Completely unaffected, runs alongside daily apps |
| **Installation Difficulty** | High (risk of soft-brick or bootloop) | Low (install APK, run script, connect) |
| **Hardware Packet Injection** | Supported (via compatible OTG adapters) | Emulated sockets (layer 3 / 4 tools only) |
| **GUI Desktop (XFCE / Kex)** | Full support | Full support via VNC / AVNC |

For 90% of ethical hacking activities — including web application testing, Python script execution, OSINT gathering, Nmap vulnerability scanning, and hash cracking — a rootless environment is more than sufficient.

---

## Prerequisites & Compatibility

- **Android Version:** Android 8.0 Oreo through Android 15.
- **CPU Architecture:** ARM64 (aarch64) recommended for optimal package availability.
- **Free Storage:** At least 6GB to 10GB of internal storage for packages and tools.
- **Recommended Apps:**
  - **Termux** (downloaded from F-Droid or GitHub).
  - **AVNC** or **bVNC Secure** (high-performance open-source VNC clients).

---

## Step 1: Install Termux & Base Prerequisites

Ensure you are using the official release of Termux from F-Droid:

```bash
# 1. Update Termux repositories and packages
pkg update && pkg upgrade -y

# 2. Grant Termux file access permissions
termux-setup-storage

# 3. Install core packages required for virtualization
pkg install -y proot-distro git wget curl tar x11-repo
```

---

## Step 2: Deploying the Kali Linux RootFS via PRoot

KaliDroid streamlines the rootless container deployment using an automated installation script:

```bash
# 1. Clone the KaliDroid deployment repo
git clone https://github.com/ethicalexplorers/kalidroid.git
cd kalidroid

# 2. Grant execution rights
chmod +x install.sh kalidroid.sh

# 3. Launch the deployment engine
./install.sh
```

During execution, the installer:
- Downloads the official, verified Kali Linux ARM64 root filesystem (`rootfs`).
- Configures PRoot architecture binds (`/proc`, `/sys`, `/dev`, `/storage`).
- Configures default APT repositories (`kali-rolling`).
- Sets up non-root and root user shells (`kali` user with `sudo` capabilities).

---

## Step 3: Launching the Kali Linux Terminal

Once the installation wizard finishes, you can enter your Kali Linux environment anytime with:

```bash
# Launch Kali CLI
./kalidroid.sh
```

You are instantly greeted with the iconic Kali Linux terminal banner:
```text
┌──(kali㉿localhost)-[~]
└─$ uname -m
aarch64
```

Update your Kali packages inside the container:
```bash
sudo apt update && sudo apt upgrade -y
```

---

## Step 4: Setting Up Graphical Desktop (XFCE4 + VNC)

For tools that require a GUI (such as Burp Suite, Wireshark, Armitage, or Ghidra), configure the lightweight XFCE4 desktop:

```bash
# Inside the Kali terminal:
sudo apt install -y kali-desktop-xfce tigervnc-standalone-server

# Initialize VNC server credentials
vncserver -localhost no :1
```

Set a 6-to-8 character password when prompted.

Now open your VNC client (**AVNC** or **bVNC**) on your phone:
- **Address / Host:** `127.0.0.1`
- **Port:** `5901`
- **Password:** The password you just created
- Tap **Connect**!

You now have a full, high-resolution Kali Linux desktop running smoothly on your phone screen!

---

## Step 5: Installing Essential Pentesting Arsenal

With your Kali environment operating, install the core cybersecurity packages:

```bash
# Information Gathering & Web Testing
sudo apt install -y nmap sqlmap nikto whois dnsutils

# Exploit Framework
sudo apt install -y metasploit-framework

# Password Auditing & Cracking
sudo apt install -y john hydra wordlists

# Python Security Libraries
sudo apt install -y python3-scapy python3-requests python3-impacket
```

---

## Performance & Battery Optimization Tips

To get the most out of KaliDroid during intensive pentesting operations:
1. **Disable Android Battery Optimization:** In your Android system settings, set Termux battery usage to **Unrestricted** to prevent the OS from killing background tasks.
2. **Acquire Termux Wake Lock:** Swipe down the notification shade and tap **Acquire Wake Lock** so scans continue even when your screen turns off.
3. **Use ZRAM / Swap Memory:** If your device has 4GB or less of RAM, use Termux storage swap or Android RAM Plus to prevent out-of-memory terminations during Metasploit compilations.

Watch our complete video guide for real-world demonstrations of KaliDroid running web assessments and network scans!"""
  }
]

with open('data/posts.json', 'r') as f:
    posts = json.load(f)

new_ids = {a['id'] for a in articles}
filtered_posts = [p for p in posts if p['id'] not in new_ids]
updated_posts = articles + filtered_posts

with open('data/posts.json', 'w') as f:
    json.dump(updated_posts, f, indent=2)

print(f"Successfully updated data/posts.json! Total posts: {len(updated_posts)}")
