# Security Policy

## Supported Versions

We actively support the following versions of this project:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

### 🔒 **Private Reporting (Preferred)**

1. **Email**: Send details to singh@janpreet.com
2. **Subject**: Use "SECURITY: [Brief Description]"
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

### 📋 **What to Include**

- **Vulnerability Type**: Buffer overflow, injection, authentication bypass, etc.
- **Affected Components**: Calendar data, date parsing, web interface, etc.
- **Reproduction Steps**: Clear steps to reproduce the issue
- **Impact Assessment**: Potential consequences of the vulnerability
- **Environment**: Operating system, Node.js version, etc.

### ⏱️ **Response Timeline**

- **Initial Response**: Within 48 hours
- **Triage**: Within 1 week
- **Fix Development**: Varies by complexity
- **Disclosure**: After fix is released

## Security Considerations

### 📅 **Calendar Data Integrity**

This project handles religious calendar data, making accuracy critical:

- **Data Tampering**: Calendar data could be modified to show incorrect religious dates
- **Source Validation**: SGPC data sources should be verified for authenticity
- **Automated Updates**: GitHub Actions workflows should be secured against malicious PRs

### 🔧 **Dependencies**

- **npm Packages**: We regularly audit dependencies for vulnerabilities
- **Automated Scanning**: GitHub Dependabot monitors for security updates
- **Manual Review**: Critical dependencies are manually reviewed

### 🌐 **Web Interface**

- **XSS Prevention**: Calendar display should sanitize all user inputs
- **CSP Headers**: Content Security Policy should be implemented
- **Input Validation**: Date parsing should validate input formats

### 📦 **Package Distribution**

- **npm Publishing**: Automated publishing should be secured
- **Code Signing**: Consider signing releases for integrity verification
- **Supply Chain**: Monitor for unauthorized package modifications

## Security Best Practices

### For Contributors

1. **Never commit sensitive data** (API keys, tokens, passwords)
2. **Use secure coding practices** when handling date parsing
3. **Validate all inputs** from external sources
4. **Follow the principle of least privilege** in automation
5. **Keep dependencies updated** and audit regularly

### For Users

1. **Verify package integrity** when installing
2. **Use official sources** (npm, GitHub releases)
3. **Keep the package updated** to latest stable version
4. **Report suspicious behavior** immediately

## Common Vulnerabilities

### 🚨 **High Priority**

- **Calendar Data Manipulation**: Incorrect religious dates could mislead users
- **Code Injection**: Malicious code in calendar data or dependencies
- **Authentication Bypass**: Unauthorized access to update mechanisms

### ⚠️ **Medium Priority**

- **Date Parsing Issues**: Buffer overflows or crashes from malformed dates
- **Dependency Vulnerabilities**: Security issues in third-party packages
- **Information Disclosure**: Leaking sensitive configuration or data

### 💡 **Low Priority**

- **Resource Exhaustion**: DoS through calendar generation overload
- **Privacy Concerns**: Tracking or data collection in web interface

## Disclosure Policy

We follow responsible disclosure practices:

1. **Private Notification**: Security issues are handled privately initially
2. **Coordinated Disclosure**: Public disclosure after fix is available
3. **Credit**: Security researchers are credited (if desired)
4. **CVE Assignment**: Critical vulnerabilities may receive CVE numbers

## Security Updates

Security patches will be:

- **Prioritized**: Released as soon as possible
- **Clearly Marked**: Tagged with security labels
- **Documented**: Include details about the fix
- **Backwards Compatible**: When possible, maintain API compatibility

## Contact Information

- **Primary**: singh@janpreet.com
- **GitHub**: Create a private vulnerability report via GitHub Security tab
- **Response Time**: 48 hours maximum

## Legal

- **Safe Harbor**: We won't take legal action against researchers who follow responsible disclosure
- **Good Faith**: Security research conducted in good faith is welcome
- **Scope**: This policy applies to the nanakshahi-ical project and related repositories

## Security Hall of Fame

We appreciate security researchers who help keep this project secure:

<!-- Security researchers will be listed here after reporting vulnerabilities -->

*No vulnerabilities reported yet.*

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Documentation](https://docs.npmjs.com/about-security-audits)
- [GitHub Security Features](https://github.com/features/security)

---

**Thank you for helping keep our calendar project secure!** 🙏 