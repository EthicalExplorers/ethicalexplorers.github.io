import json
import os

new_articles = [
  {
    "id": "rucky-android-usb-rubber-ducky-kali-nethunter-hid-tutorial",
    "title": "Rucky Tutorial: Turn Your Android Phone Into a USB Rubber Ducky (Kali NetHunter HID)",
    "excerpt": "Turn any rooted Android smartphone into a USB Rubber Ducky keystroke injection tool using Rucky and Kali NetHunter. Learn HID kernel configuration, USB gadget setup, Ducky Script syntax, and defense.",
    "category": "Penetration Testing",
    "tags": ["Rucky", "USB-Rubber-Ducky", "Kali-NetHunter", "HID-Attacks", "Android-Hacking", "Keystroke-Injection"],
    "date": "2026-09-11",
    "author": "Ethical Explorers Team",
    "readTime": "11 min read",
    "image": "images/blog/rucky-android-usb-rubber-ducky.jpg",
    "featured": True,
    "youtubeId": "2WddE7dbiRA",
    "content": """**Rucky** is a powerful open-source Android application that transforms any rooted Android device with a compatible kernel into a programmable **USB Human Interface Device (HID)** — functioning identically to a commercial hardware **USB Rubber Ducky**. In physical penetration testing and red teaming, physical keystroke injection remains one of the fastest vectors for bypassing endpoint protections, executing staging scripts, and establishing initial access within seconds of physical connection.

In this comprehensive tutorial based on our Ethical Explorers video demonstration, we cover the theory of USB HID attacks, requirements for Android hardware, how to patch and configure the Linux kernel USB gadget driver, how to resolve the dreaded "kernel not supported" error, Ducky Script syntax, and defensive countermeasures for security operations teams.

---

## What is a USB HID Attack & Why Does It Work?

Operating systems (Windows, Linux, macOS, Android, ChromeOS) inherently trust **Human Interface Devices (HID)** such as standard physical USB keyboards and mice:

- **Implicit Trust Model:** When a USB keyboard is inserted, the operating system does not require administrative driver installations, user approval prompts, or antivirus scanning. It immediately recognizes the device as a standard input mechanism.
- **Superhuman Typing Speed:** While a human types at 40–80 words per minute, an automated HID emulator transmits pre-programmed keystrokes at thousands of characters per minute (over 1,000 keystrokes per second).
- **Endpoint Protection Evasion:** Modern Endpoint Detection & Response (EDR) agents monitor incoming network packets, memory injections, and untrusted binaries. However, an administrative PowerShell command typed directly through a keyboard driver appears to the OS as authentic physical user interaction.

```text
[Rooted Android Phone + Rucky]
              │
              │ (USB-C to USB-A / USB-C Cable)
              ▼
[USB ConfigFS Gadget: /dev/hidg0 Keyboard Emulation]
              │
              │ (Sends Scancodes: 1000+ chars/sec)
              ▼
[Target Computer (Windows / Linux / macOS)]
   └── Executes Run Dialog (GUI + r) -> PowerShell / Terminal Command
```

---

## Hardware & Environment Requirements

To use Rucky for USB HID keystroke injection, your setup must meet specific prerequisites:

| Requirement | Specification | Why It Is Needed |
| :--- | :--- | :--- |
| **Android Device** | Rooted Android smartphone (ARM64) | Superuser privileges to interact with `/dev/hidg*` character devices |
| **Linux Kernel** | USB Gadget ConfigFS / HID support | Native kernel driver capable of emulating USB keyboard & mouse descriptors |
| **Root Suite** | Magisk or KernelSU | Manages root permissions and kernel module mounts |
| **NetHunter App** | Kali NetHunter App Store / USB Arsenal | Convenient interface to enable USB HID state and switch gadget profiles |
| **Data Cable** | High-quality USB-C to USB-A / USB-C data cable | Must support high-speed data transmission (charge-only cables will not work) |

---

## Resolving the "Kernel Not Supported" Error

The most frequent hurdle when configuring Rucky on Android is the error message: `Kernel does not support USB HID`.

Most stock OEM kernels (Samsung, Xiaomi, OnePlus) disable USB HID gadget drivers in their default defconfig for security and power saving. You have two primary ways to resolve this:

### Option 1: Install a NetHunter-Supported Custom Kernel
If your device has an active Kali NetHunter kernel build (available on the official Kali NetHunter repository for devices like OnePlus 7/8/9, Xiaomi Poco, Pixel series), flash the kernel ZIP via TWRP/OrangeFox or KernelFlasher. These kernels have `CONFIG_USB_CONFIGFS_F_HID=y` compiled in by default.

### Option 2: Use Kali NetHunter USB Arsenal Module
If running a Magisk-rooted device:
1. Open the **Kali NetHunter App**.
2. Navigate to **USB Arsenal**.
3. Under **Target Device**, select your target platform (`Windows`, `Linux`, or `macOS`).
4. Select **HID** mode and tap **Mount / Enable**.
5. NetHunter configures the Linux ConfigFS gadget interface under `/sys/kernel/config/usb_gadget/` and creates `/dev/hidg0` (keyboard) and `/dev/hidg1` (mouse).

Verify character devices from a root terminal:
```bash
su
ls -l /dev/hidg*
# You should see:
# crw------- 1 root root 242, 0 /dev/hidg0
# crw------- 1 root root 242, 1 /dev/hidg1
```

---

## Installing & Configuring Rucky

1. Download the latest **Rucky APK** from official trusted repositories (GitHub / NetHunter Store).
2. Install and launch Rucky on your Android phone.
3. Grant **Superuser (Root)** permissions when prompted by Magisk or KernelSU.
4. Go to **Settings** in Rucky:
   - **HID Interface Path:** Ensure it is set to `/dev/hidg0`.
   - **Keyboard Layout:** Select your target language/region (e.g., `US`, `UK`, `German`, `Spanish`). Matching the layout is critical so punctuation and symbols map correctly.
   - **Stealth Mode:** Enable stealth mode to hide the notification icon and mute vibration feedback during execution.

---

## Understanding Ducky Script Syntax

Rucky supports standard **Ducky Script** syntax, making it easy to create and customize payloads. Here are the core commands:

```text
REM ==========================================
REM Ethical Explorers - Basic Ducky Script Demo
REM Target: Windows 10/11
REM ==========================================

DELAY 2000
GUI r
DELAY 500
STRING powershell -NoP -NonI -W Hidden -Exec Bypass
ENTER
DELAY 1000
STRING Write-Host "USB HID Keystroke Injection Test Successful!" -ForegroundColor Green
ENTER
```

### Key Ducky Script Commands:
- `DELAY [ms]`: Pauses execution (e.g., `DELAY 1000` waits 1 second) to allow target OS dialogs to open.
- `GUI` or `WINDOWS`: Presses the Windows key / Command key (e.g., `GUI r` launches the Windows Run dialog).
- `STRING [text]`: Types the specified text string at high speed.
- `ENTER`: Emulates the Return/Enter key.
- `CTRL-ALT` / `SHIFT` / `ALT`: Modifier key combinations (e.g., `CONTROL ESCAPE` opens the Start menu).
- `REM`: Comment line ignored during execution.

---

## Practical Hands-on Demonstration: Safe Testing

In our YouTube demonstration, we test an automated benign diagnostic script to confirm payload speed and reliability:

1. Connect the rooted Android smartphone to the test machine via USB.
2. In Rucky, tap the **Payloader Editor** and paste your Ducky Script.
3. Tap **Syntax Check** to ensure no formatting errors exist.
4. Tap the **Run / Launch Attack** button.
5. Observe the target computer: within milliseconds, the dialog launches, executes the string, and completes before an observer can react.

---

## Defensive Countermeasures: How to Stop BadUSB Attacks

Enterprise defenders, system administrators, and security teams can effectively mitigate HID injection attacks:

1. **Endpoint USB Port Access Control (GPO / InTune):** Block installation of unauthorized USB device classes (specifically class `03h` HID devices) that do not match pre-whitelisted hardware Vendor and Product IDs (VID/PID).
2. **Deploy Software Defenses (DuckHunt / USG):** Use open-source keystroke analysis agents like **DuckHunt** that monitor typing cadence; keystrokes injected faster than human typing thresholds trigger an immediate lock-screen freeze.
3. **Restricted PowerShell Execution Policies & Constrained Language Mode:** Prevent one-line payload execution from non-interactive prompts.
4. **Physical Port Blockers:** In high-security environments, physically block exposed USB-A and USB-C ports with physical key locks.

Watch our complete YouTube video tutorial for the live demonstration and step-by-step NetHunter setup!"""
  },
  {
    "id": "strykeross-rootless-android-setup-guide-qemu-wifi-adapter",
    "title": "StrykerOSS Rootless Guide: Mobile Pentesting on Android Without Root (QEMU & OTG WiFi)",
    "excerpt": "Run StrykerOSS on any unrooted Android smartphone using the Rootless QEMU virtualization engine. Comprehensive setup guide covering environment deployment, VNC desktop, OTG Wi-Fi adapter setup, and tools.",
    "category": "Penetration Testing",
    "tags": ["StrykerOSS", "Android", "Rootless", "QEMU", "WiFi-Auditing", "Mobile-Pentesting"],
    "date": "2026-09-10",
    "author": "Ethical Explorers Team",
    "readTime": "12 min read",
    "image": "images/blog/strykeross-rootless-android.jpg",
    "featured": True,
    "youtubeId": "5IWUuIrRYPE",
    "content": """**StrykerOSS** has transformed mobile cybersecurity testing by bringing a complete offensive security framework to Android smartphones. However, many cybersecurity students, field operators, and professionals cannot root their daily driver phones due to enterprise MDM policies, corporate banking applications, warranty constraints, or SafetyNet/Knox security locks.

The newly released **StrykerOSS Rootless** mode solves this challenge by leveraging a high-performance **QEMU (Quick Emulator)** virtualization engine inside Android user space. This enables you to deploy the complete StrykerOSS dashboard, network scanners, VNC graphical interface, and external USB Wi-Fi adapters without touching system partitions or unlocking bootloaders.

In this comprehensive guide based on our Ethical Explorers video tutorial, we walk through the entire Rootless architecture, installation workflow, OTG Wi-Fi adapter integration, tool operation, and performance tuning.

---

## Architecture: How StrykerOSS Runs Without Root

Running Linux pentesting distributions on non-rooted Android has evolved from basic chroot/proot wrappers to full hardware-assisted userland virtualization:

| Component | Function in StrykerOSS Rootless |
| :--- | :--- |
| **Android Userland (No Root)** | Host operating system providing battery, display, and memory resources |
| **Termux Environment** | POSIX terminal runtime environment handling execution wrappers |
| **QEMU Virtual Engine** | Emulates system hardware, CPU instructions, and sandboxed storage partitions |
| **Custom Linux RootFS** | Tailored penetration testing filesystem pre-loaded with Nmap, Nuclei, Metasploit, and Python toolchains |
| **TigerVNC / Wayland Server** | Streams graphical tools and web dashboards to the local Android screen via localhost |

```text
┌────────────────────────────────────────────────────────┐
│               Android Phone (Unrooted)                │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Termux POSIX Userland Environment                │  │
│  │                                                  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ QEMU Virtual Machine Engine (Userland)     │  │  │
│  │  │                                            │  │  │
│  │  │  ┌──────────────────────────────────────┐  │  │  │
│  │  │  │ StrykerOSS Linux OS & Cyber Arsenal  │  │  │  │
│  │  │  │ • Nmap Network Scanner               │  │  │  │
│  │  │  │ • Nuclei Vulnerability Engine        │  │  │  │
│  │  │  │ • GeoMAC Wireless Intelligence       │  │  │  │
│  │  │  │ • Metasploit Framework               │  │  │  │
│  │  │  │ • TigerVNC GUI Desktop               │  │  │  │
│  │  │  └──────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│         ▲                                              │
│         │ (USB-OTG Bridge)                             │
│  ┌──────┴───────────────────────────────────────────┐  │
│  │ External USB Wi-Fi Adapter (RTL8812AU / RT3070)   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## Step 1: Device Configuration & Permissions

Before running the StrykerOSS installer, prepare your Android device to prevent background terminations:

1. **Install Termux from F-Droid:** Avoid the legacy Google Play Store build. Download the latest release from F-Droid or the official GitHub repository.
2. **Grant Storage Access:**
   ```bash
   termux-setup-storage
   ```
   Accept the Android file permission prompt to allow StrykerOSS to read wordlists and save scan reports.
3. **Disable Battery Optimization:**
   - Go to **Android Settings** -> **Apps** -> **Termux** -> **Battery**.
   - Set to **Unrestricted** (or "Don't Optimize"). This prevents Android's aggressive memory management from killing the QEMU engine mid-scan.
4. **Acquire Termux Wake Lock:**
   Pull down the Android notification shade and tap **Acquire Wake Lock** on Termux.

---

## Step 2: Downloading & Running the StrykerOSS Installer

Open Termux and execute the base package installation:

```bash
# Update repository packages
pkg update && pkg upgrade -y

# Install git, wget, and core runtime utilities
pkg install -y git wget curl qemu-utils qemu-system-x86_64-headless

# Clone the StrykerOSS deployment repository
git clone https://github.com/zalexdev/StrykerOSS.git
cd StrykerOSS

# Grant executable rights
chmod +x setup.sh

# Launch the interactive installation wizard
./setup.sh
```

During the interactive wizard:
- When prompted for **Engine Mode**, choose `[2] Rootless (QEMU Engine)`.
- The wizard automatically checks device architecture (`arm64-v8a`), allocates virtual disk space (minimum 8GB recommended), and downloads the optimized pre-configured Stryker Linux image.

---

## Step 3: Launching StrykerOSS & The Tactical Dashboard

Once initialization completes, start StrykerOSS:

```bash
./stryker.sh
```

You are greeted by the StrykerOSS tactical banner and interactive menu:

- **[1] Core Manager:** View system resources, active CPU utilization, memory allocation, and virtual network adapters.
- **[2] Arsenal:** Launch pre-compiled security tools including Nmap, Nuclei, SQLMap, Gobuster, and John the Ripper.
- **[3] GeoMAC Recon:** Automated wireless BSSID lookup against open geolocation databases (Wigle.net).
- **[4] VNC GUI Desktop:** Start TigerVNC server on port `5901` and connect via AVNC or NetHunter Kex app to access the complete graphical XFCE desktop.

---

## Step 4: Connecting an External USB Wi-Fi Adapter (OTG)

One of the standout features of modern mobile testing is using external high-gain Wi-Fi adapters. In Rootless mode:

1. Connect a compatible Wi-Fi dongle (e.g., **Realtek RTL8812AU**, **Ralink RT3070**, or **Atheros AR9271**) using a reliable USB-C OTG adapter.
2. In Termux, pass the USB device to the QEMU environment:
   ```bash
   lsusb
   # Identify vendor and product ID (e.g., 0bda:8812)
   ```
3. Use Stryker's built-in USB Passthrough utility to bind the adapter into the guest environment.

> [!NOTE]
> **Rootless vs Rooted Limitations:** While standard network scanning and managed-mode connections work smoothly in QEMU Rootless mode, raw packet injection and monitor mode (`airmon-ng`) require kernel-level socket access that is only fully supported on rooted NetHunter kernels. For wireless deauthentication or active handshake capture, a rooted setup remains recommended.

---

## Rooted vs Rootless Comparison Matrix

| Feature | StrykerOSS (Rooted) | StrykerOSS Rootless (QEMU) |
| :--- | :--- | :--- |
| **Installation Difficulty** | Requires Magisk / Custom Kernel | Simple (No unlocked bootloader needed) |
| **Warranty & Safety** | Trips Knox / SafetyNet | 100% Safe for daily driver devices |
| **Banking & Work Apps** | May fail root checks | Runs alongside all standard apps |
| **Raw Packet Injection** | Full Support (Kernel driver) | Limited by Userland USB Emulation |
| **Nmap & Network Scanning** | Full Speed (SYN, ACK, UDP) | TCP Connect & User-mode sockets |
| **VNC Desktop GUI** | Smooth line-rate rendering | Smooth (Powered by QEMU RAM cache) |

---

## Operational Security Tips for Field Testers

When conducting authorized physical and wireless penetration assessments with StrykerOSS Rootless:

1. **Use an external power bank:** QEMU emulation increases CPU activity and battery drain during active scans.
2. **Export scan results to local storage:** Save reports to `/sdcard/Download/` so you can review findings or upload them to client reporting portals directly from your mobile browser.
3. **Keep your wordlists compressed:** Use `.gz` compressed wordlists (such as `rockyou.txt.gz`) to save internal flash storage on your Android device.

Watch our complete YouTube video guide for the step-by-step installation and interface walkthrough!"""
  },
  {
    "id": "raspberry-pi-openwrt-router-wifi-hotspot-ssh-network-setup-part-2",
    "title": "Raspberry Pi OpenWrt Router (Part 2): WiFi Hotspot, Secure SSH & Network Configuration",
    "excerpt": "Complete Part 2 guide to configuring your Raspberry Pi OpenWrt router. Learn SSH root hardening, UCI configuration backups, LAN & WWAN routing, firewall zones, and internal Wi-Fi hotspot setup.",
    "category": "Network Security",
    "tags": ["OpenWrt", "Raspberry-Pi", "WiFi-Hotspot", "Network-Security", "SSH-Hardening", "Firewall"],
    "date": "2026-09-09",
    "author": "Ethical Explorers Team",
    "readTime": "13 min read",
    "image": "images/blog/openwrt-raspberry-pi-part2.jpg",
    "featured": True,
    "youtubeId": "kyWmDdiucDE",
    "content": """In **Part 1** of our Raspberry Pi OpenWrt series, we flashed the raw OpenWrt ext4 factory image onto an SD card, completed the initial bootstrap on a Raspberry Pi 4 Model B, and initialized the LuCI web interface. In **Part 2**, we transform this baseline installation into a fully functional, hardened network router and high-speed Wi-Fi access point.

A custom OpenWrt router gives you complete visibility over DNS queries, firewall routing policies, bandwidth allocation, and intrusion prevention without relying on opaque, unpatched ISP modem firmware.

In this deep dive based on our Ethical Explorers video walkthrough, you will learn how to secure SSH access, backup core configuration files via CLI, configure LAN and WWAN interfaces, adjust firewall zones, and enable the Raspberry Pi's internal Broadcom wireless radio as a protected Wi-Fi hotspot.

---

## Topology & Network Architecture

Here is the network flow configured in this guide:

```text
[ISP Modem / Upstream Internet]
              │
              │ (DHCP Client / WWAN)
              ▼
[Raspberry Pi 4 Model B (OpenWrt Router)]
   ├── Internal Firewall (Drop Inbound, Allow Forward to LAN, Masquerade)
   ├── SSH Service (Dropbear Hardened on Port 22)
   ├── Gigabit Ethernet (eth0: LAN Gateway 192.168.1.1/24 with Dnsmasq DHCP)
   └── Internal Broadcom Wi-Fi Radio (radio0: WPA2/WPA3 Hotspot AP)
              │
              ├── Wired Clients (Switch, Desktop, NAS)
              └── Wireless Clients (Smartphones, Laptops, IoT Devices)
```

---

## Step 1: Securing OpenWrt SSH Access with Root Hardening

By default, freshly flashed OpenWrt instances allow unauthenticated root logins over the local LAN. Immediate hardening is essential:

```bash
# Connect to OpenWrt router default IP
ssh root@192.168.1.1
```

Set a complex root password immediately:
```bash
passwd
# Enter a strong password (at least 16 characters containing mixed case, numbers, symbols)
```

### Harden Dropbear SSH Configuration:
Edit `/etc/config/dropbear` to disable password authentication once your SSH public key is deployed:

```bash
# Push your computer's public SSH key to the Pi
cat ~/.ssh/id_ed25519.pub | ssh root@192.168.1.1 "cat >> /etc/dropbear/authorized_keys"

# Inside OpenWrt shell:
uci set dropbear.@dropbear[0].PasswordAuth='off'
uci set dropbear.@dropbear[0].RootPasswordAuth='off'
uci commit dropbear
/etc/init.d/dropbear restart
```

Now, only clients presenting your verified cryptographic SSH key can access administrative shell sessions.

---

## Step 2: Creating Configuration Backups via CLI & LuCI

Before modifying routing and firewall policies, always generate a backup so you can recover instantly if you lock yourself out:

### CLI Backup Command:
```bash
# Create a timestamped compressed backup of /etc/config/ and custom scripts
sysupgrade -b /tmp/openwrt-backup-$(date +%Y%m%d).tar.gz

# Copy the backup archive to your local workstation
scp root@192.168.1.1:/tmp/openwrt-backup-*.tar.gz ~/Backups/
```

### LuCI Web Interface Backup:
Navigate to **System** -> **Backup / Flash Firmware**, and under **Download backup**, click **Generate archive**. Store this file securely.

---

## Step 3: Configuring the LAN Subnet & Static IP Addressing

If your upstream ISP modem also uses `192.168.1.1`, an IP conflict will occur when connecting WAN. Change the Raspberry Pi's LAN subnet to a distinct address space (e.g., `192.168.8.1`):

```bash
# Update LAN IP using UCI (Unified Configuration Interface)
uci set network.lan.ipaddr='192.168.8.1'
uci set network.lan.netmask='255.255.255.0'

# Commit and reload network service
uci commit network
/etc/init.d/network restart
```

> [!IMPORTANT]
> Once the network service reloads, reconnect your computer's Ethernet cable or run `dhclient -r && dhclient eth0` on Linux (or `ipconfig /renew` on Windows) to obtain an IP in the new `192.168.8.x` subnet. The LuCI interface will now be accessible at `http://192.168.8.1`.

---

## Step 4: Configuring WWAN & Secure Upstream DNS

To route traffic through an upstream network while testing, configure the Wireless WAN (WWAN) interface or secondary Ethernet interface:

```bash
# Configure custom encrypted DNS resolvers (Cloudflare & Quad9)
uci set network.lan.dns='1.1.1.1 9.9.9.9'
uci commit network
/etc/init.d/network restart
```

### Configure Dnsmasq DNS Caching:
Ensure OpenWrt intercepts rogue DNS requests and prevents DNS leaks:
```bash
uci set dhcp.@dnsmasq[0].strictorder='1'
uci set dhcp.@dnsmasq[0].noresolv='1'
uci add_list dhcp.@dnsmasq[0].server='1.1.1.1'
uci add_list dhcp.@dnsmasq[0].server='9.9.9.9'
uci commit dhcp
/etc/init.d/dnsmasq restart
```

---

## Step 5: Adjusting Firewall Rules & Zone Forwarding

OpenWrt utilizes `fw4` (Netfilter / nftables backend). Verify that traffic from your LAN and Wi-Fi zone can reach the WAN interface:

1. In LuCI, navigate to **Network** -> **Firewall**.
2. Under **General Settings**, verify:
   - **Input:** `Reject` (Blocks unsolicited inbound WAN traffic).
   - **Output:** `Accept` (Allows router to originate traffic).
   - **Forward:** `Reject` (Prevents unauthorized routing between untrusted zones).
3. Under **Zones**:
   - Ensure `lan` zone has **Masquerading** enabled and forwards to `wan`.

CLI Verification:
```bash
uci show firewall.@zone[0]
uci show firewall.@zone[1]
```

---

## Step 6: Enabling the Internal Wi-Fi Hotspot (`radio0`)

The Raspberry Pi 4 Model B contains an onboard Broadcom BCM43455 Wi-Fi chip supporting 2.4 GHz and 5 GHz (802.11ac). By default, OpenWrt sets the wireless radio to `disabled='1'`.

### Enable and Configure via UCI:
```bash
# Set your two-letter ISO regulatory country code (e.g., US, GB, IN, DE)
uci set wireless.radio0.country='US'

# Enable radio interface
uci set wireless.radio0.disabled='0'
uci set wireless.radio0.band='5g'
uci set wireless.radio0.channel='36'
uci set wireless.radio0.htmode='VHT80'

# Configure the Access Point (AP) SSID and encryption
uci set wireless.default_radio0.mode='ap'
uci set wireless.default_radio0.ssid='EthicalExplorers_SecureLab'
uci set wireless.default_radio0.encryption='sae-mixed'
uci set wireless.default_radio0.key='SuperSecureCyberPass2026!'
uci set wireless.default_radio0.network='lan'

# Commit and reload Wi-Fi engine
uci commit wireless
wifi reload
```

### Verify Wireless Hotspot Status:
```bash
iwinfo wlan0 info
```
You should see:
- **Mode:** Master (Access Point)
- **ESSID:** "EthicalExplorers_SecureLab"
- **Channel:** 36 (5.180 GHz)
- **Encryption:** WPA2/WPA3 Mixed (PSK/SAE)

---

## Step 7: Connecting Clients & Throughput Testing

Grab your smartphone or laptop, scan for available Wi-Fi networks, and connect to **EthicalExplorers_SecureLab** using your password.

1. Verify client IP assignment: Open terminal on your client device and check your default gateway (`192.168.8.1`).
2. Run an `iperf3` speed test across the internal Wi-Fi bridge:
   ```bash
   # On OpenWrt (install iperf3):
   opkg update && opkg install iperf3
   iperf3 -s

   # On client laptop:
   iperf3 -c 192.168.8.1
   ```
   The Raspberry Pi 4 easily sustains 100–180 Mbps over the internal 5GHz radio while maintaining line-rate 940+ Mbps over wired Gigabit Ethernet!

---

## Common Troubleshooting Tips

1. **Wi-Fi Interface Does Not Broadcast:**
   - Verify country code is set (`uci get wireless.radio0.country`). Regulatory domain blocks transmission without a valid country code.
   - Install full WPA3 supplicant packages if using SAE: `opkg update && opkg install wpad-openssl`.
2. **Cannot Access LuCI After IP Change:**
   - Flush client DNS and ARP tables (`arp -d 192.168.1.1`).
   - Disconnect and reconnect Ethernet cable to trigger a new DHCP lease from the Pi's DHCP server.

---

## Next Steps: What to Expect in Part 3

With your secure Wi-Fi hotspot, hardened SSH access, and verified firewall routing in place, your Raspberry Pi 4 is now a rock-solid core router. In **Part 3**, we will attach external high-gain dual-band USB Wi-Fi dongles, configure seamless network bridging, deploy WireGuard site-to-site tunnels, and install **SQM Cake** for zero-latency gaming and VoIP bufferbloat elimination!

Watch our full YouTube tutorial for the complete video walkthrough and live configuration demonstration!"""
  }
]

# Load existing posts
POSTS_PATH = 'data/posts.json'
with open(POSTS_PATH, 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Collect new IDs
new_ids = {a['id'] for a in new_articles}

# Filter out if any exist already
filtered_posts = [p for p in posts if p['id'] not in new_ids]

# Prepend new articles
updated_posts = new_articles + filtered_posts

with open(POSTS_PATH, 'w', encoding='utf-8') as f:
    json.dump(updated_posts, f, indent=2, ensure_ascii=False)

print(f"✅ Successfully updated {POSTS_PATH}!")
print(f"Total posts now: {len(updated_posts)}")
print(f"Top 3 posts: {[p['id'] for p in updated_posts[:3]]}")
