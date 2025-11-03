// Training logs module
export class TrainingLogs {
    constructor() {
        this.logList = document.getElementById('logList');
        this.btnCopyLogs = document.getElementById('btnCopyLogs');
        this.btnDownloadLogs = document.getElementById('btnDownloadLogs');
        this.btnClearLogs = document.getElementById('btnClearLogs');

        this.initializeControls();
    }

    initializeControls() {
        if(this.btnCopyLogs) {
            this.btnCopyLogs.addEventListener('click', () => this.copyLogs());
        }
        
        if(this.btnDownloadLogs) {
            this.btnDownloadLogs.addEventListener('click', () => this.downloadLogs());
        }
        
        if(this.btnClearLogs) {
            this.btnClearLogs.addEventListener('click', () => this.clearLogs());
        }
    }

    log(text) {
        const li = document.createElement('li');
        const t = new Date().toLocaleTimeString();
        li.textContent = `${t} — ${text}`;
        // append new logs so the newest appears at the bottom
        this.logList.appendChild(li);
    }

    getLogsText() {
        const items = Array.from(this.logList.querySelectorAll('li'));
        if(items.length === 0) return '';
        return items.map(i => i.textContent).join('\n');
    }

    async copyLogs() {
        const text = this.getLogsText();
        if(!text){ this.log('No logs to copy'); return; }
        try {
            if(navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            this.log('Logs copied to clipboard');
        } catch(err) {
            this.log('Copy failed');
        }
    }

    downloadLogs() {
        const text = this.getLogsText();
        if(!text){ this.log('No logs to download'); return; }
        const blob = new Blob([text], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'training-logs.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        this.log('Logs downloaded');
    }

    clearLogs() {
        this.logList.innerHTML = '';
        this.log('Logs cleared');
    }
}