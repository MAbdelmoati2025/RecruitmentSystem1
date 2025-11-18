import React, { useState, useRef } from 'react';
import { Upload, Send, Eye, Download, AlertCircle, CheckCircle, XCircle, PlayCircle, PauseCircle, FileText, Users, MessageSquare, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';

function WhatsAppExtension() {
  const [file, setFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sendingStats, setSendingStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0
  });
  const [sendingResults, setSendingResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [delayBetweenMessages, setDelayBetweenMessages] = useState(3);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // معالجة رفع الملف
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // استخراج البيانات
        const extractedContacts = jsonData.map((row, index) => ({
          id: index + 1,
          name: row['Name'] || row['name'] || row['الاسم'] || 'Unknown',
          phone: String(row['Phone'] || row['phone'] || row['رقم الهاتف'] || '').replace(/\D/g, ''),
          company: row['Company'] || row['company'] || row['الشركة'] || '',
          position: row['Position'] || row['position'] || row['الوظيفة'] || '',
          status: 'pending'
        })).filter(contact => contact.phone.length >= 10);

        setContacts(extractedContacts);
        setFile(uploadedFile);
        setSendingStats({
          total: extractedContacts.length,
          sent: 0,
          failed: 0,
          pending: extractedContacts.length
        });
        alert(`✅ تم تحميل ${extractedContacts.length} جهة اتصال بنجاح!`);
      } catch (error) {
        console.error('File parsing error:', error);
        alert('❌ خطأ في قراءة الملف. تأكد من أن الملف Excel صحيح.');
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  // معاينة الرسالة مع البيانات الديناميكية
  const generatePreview = () => {
    if (!message.trim() || contacts.length === 0) return;

    const sampleContact = contacts[0];
    let preview = message;
    preview = preview.replace(/\{name\}/gi, sampleContact.name);
    preview = preview.replace(/\{company\}/gi, sampleContact.company);
    preview = preview.replace(/\{position\}/gi, sampleContact.position);
    setPreviewMessage(preview);
  };

  // Send messages
  const startSending = async () => {
    if (!message.trim()) {
      alert('⚠️ Please write a message first');
      return;
    }

    if (contacts.length === 0) {
      alert('⚠️ Please upload contacts file');
      return;
    }

    setSending(true);
    setPaused(false);
    setShowResults(false);
    abortControllerRef.current = new AbortController();

    const results = [];
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < contacts.length; i++) {
      if (abortControllerRef.current.signal.aborted) {
        break;
      }

      const contact = contacts[i];
      
      // تخصيص الرسالة
      let personalizedMessage = message;
      personalizedMessage = personalizedMessage.replace(/\{name\}/gi, contact.name);
      personalizedMessage = personalizedMessage.replace(/\{company\}/gi, contact.company);
      personalizedMessage = personalizedMessage.replace(/\{position\}/gi, contact.position);

      try {
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/${contact.phone}?text=${encodeURIComponent(personalizedMessage)}`;
        window.open(whatsappUrl, '_blank');

        results.push({
          ...contact,
          status: 'sent',
          sentAt: new Date().toLocaleTimeString()
        });
        sent++;

        // Update contact status
        setContacts(prev => prev.map(c => 
          c.id === contact.id ? { ...c, status: 'sent' } : c
        ));

      } catch (error) {
        results.push({
          ...contact,
          status: 'failed',
          error: error.message
        });
        failed++;

        setContacts(prev => prev.map(c => 
          c.id === contact.id ? { ...c, status: 'failed' } : c
        ));
      }

      // Update statistics
      const currentProgress = Math.round(((i + 1) / contacts.length) * 100);
      setProgress(currentProgress);
      setSendingStats({
        total: contacts.length,
        sent: sent,
        failed: failed,
        pending: contacts.length - sent - failed
      });

      // Wait before sending next message
      if (i < contacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenMessages * 1000));
      }
    }

    setSendingResults(results);
    setSending(false);
    setShowResults(true);
    alert('✅ Messages sending completed!');
  };

  // Pause sending
  const pauseSending = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPaused(true);
    setSending(false);
  };

  // Download results
  const downloadResults = () => {
    const ws = XLSX.utils.json_to_sheet(sendingResults);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, `WhatsApp_Results_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Reset all
  const resetAll = () => {
    if (window.confirm('Do you want to delete all data and start over?')) {
      setFile(null);
      setContacts([]);
      setMessage('');
      setPreviewMessage('');
      setSending(false);
      setPaused(false);
      setProgress(0);
      setSendingStats({ total: 0, sent: 0, failed: 0, pending: 0 });
      setSendingResults([]);
      setShowResults(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-green-500 rounded-xl">
            <MessageSquare className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">WhatsApp Extension</h1>
            <p className="text-green-200/80">Send bulk messages via WhatsApp easily</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold text-white">1. Upload Excel File</h2>
        </div>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl hover:border-blue-500 transition-all cursor-pointer bg-white/5 hover:bg-white/10"
          >
            <Upload className="text-blue-400 mb-2" size={40} />
            <p className="text-white font-bold">Click to upload Excel file</p>
            <p className="text-white/60 text-sm">Must contain: Name, Phone</p>
          </label>

          {file && (
            <div className="flex items-center justify-between bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center gap-3">
                <FileText className="text-green-400" size={24} />
                <div>
                  <p className="text-white font-bold">{file.name}</p>
                  <p className="text-green-200/70 text-sm">{contacts.length} contacts</p>
                </div>
              </div>
              <button
                onClick={resetAll}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="text-purple-400" size={24} />
          <h2 className="text-xl font-bold text-white">2. Write Message</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white/80 text-sm mb-2 block">
              Use variables: {'{name}'}, {'{company}'}, {'{position}'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: Hello {name}, we would like to contact you from {company}..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <button
            onClick={generatePreview}
            disabled={!message.trim() || contacts.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye size={18} />
            Preview Message
          </button>

          {previewMessage && (
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
              <p className="text-white/70 text-sm mb-2">Preview with first contact data:</p>
              <p className="text-white whitespace-pre-wrap">{previewMessage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delay Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-yellow-400" size={24} />
          <h2 className="text-xl font-bold text-white">3. Sending Settings</h2>
        </div>

        <div className="space-y-2">
          <label className="text-white/80 text-sm">Delay between messages (seconds)</label>
          <input
            type="number"
            min="1"
            max="60"
            value={delayBetweenMessages}
            onChange={(e) => setDelayBetweenMessages(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
          />
          <p className="text-white/60 text-xs">Recommended: 3-5 seconds to avoid blocking</p>
        </div>
      </div>

      {/* Stats & Progress */}
      {contacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <Users className="text-blue-400" size={24} />
              <div>
                <p className="text-white/70 text-sm">Total</p>
                <p className="text-2xl font-black text-white">{sendingStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/20 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-400" size={24} />
              <div>
                <p className="text-white/70 text-sm">Sent</p>
                <p className="text-2xl font-black text-white">{sendingStats.sent}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/20 backdrop-blur-xl rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-400" size={24} />
              <div>
                <p className="text-white/70 text-sm">Failed</p>
                <p className="text-2xl font-black text-white">{sendingStats.failed}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/20 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-400" size={24} />
              <div>
                <p className="text-white/70 text-sm">Pending</p>
                <p className="text-2xl font-black text-white">{sendingStats.pending}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {sending && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold">Sending...</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!sending && !showResults && (
          <button
            onClick={startSending}
            disabled={!message.trim() || contacts.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send size={20} />
            Start Sending
          </button>
        )}

        {sending && (
          <button
            onClick={pauseSending}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-lg"
          >
            <PauseCircle size={20} />
            Stop
          </button>
        )}

        {showResults && (
          <>
            <button
              onClick={downloadResults}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              <Download size={20} />
              Download Results
            </button>
            <button
              onClick={resetAll}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Start Over
            </button>
          </>
        )}
      </div>

      {/* Contacts Preview Table */}
      {contacts.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Contacts Preview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/70 text-sm font-bold pb-3 px-4">#</th>
                  <th className="text-left text-white/70 text-sm font-bold pb-3 px-4">Name</th>
                  <th className="text-left text-white/70 text-sm font-bold pb-3 px-4">Phone</th>
                  <th className="text-left text-white/70 text-sm font-bold pb-3 px-4">Company</th>
                  <th className="text-left text-white/70 text-sm font-bold pb-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {contacts.slice(0, 10).map((contact) => (
                  <tr key={contact.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white/80">{contact.id}</td>
                    <td className="py-3 px-4 text-white font-bold">{contact.name}</td>
                    <td className="py-3 px-4 text-white/80 font-mono">{contact.phone}</td>
                    <td className="py-3 px-4 text-white/80">{contact.company || '-'}</td>
                    <td className="py-3 px-4">
                      {contact.status === 'pending' && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold">
                          Pending
                        </span>
                      )}
                      {contact.status === 'sent' && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                          ✓ Sent
                        </span>
                      )}
                      {contact.status === 'failed' && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                          ✗ Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length > 10 && (
              <p className="text-center text-white/60 text-sm mt-4">
                And {contacts.length - 10} more contacts...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
          <div className="space-y-2">
            <h3 className="text-white font-bold">Important Instructions:</h3>
            <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
              <li>Make sure Excel file contains "Phone" or "phone" column</li>
              <li>Phone numbers must be in international format (example: 201234567890)</li>
              <li>Use 3-5 seconds delay between messages to avoid WhatsApp blocking</li>
              <li>Recommended not to send more than 500 messages per day</li>
              <li>Make sure WhatsApp is open in browser</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppExtension;