use arboard::Clipboard;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{State, Manager, Emitter};
use std::thread;
use std::time::Duration;
use chrono::Local;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClipboardItem {
    id: String,
    #[serde(rename = "type")]
    item_type: String,
    content: String,
    preview: Option<String>,
    timestamp: String,
    #[serde(rename = "isPinned")]
    is_pinned: bool,
}

// Global state for clipboard history
pub struct ClipboardState {
    history: Mutex<Vec<ClipboardItem>>,
}

impl ClipboardState {
    pub fn new() -> Self {
        Self {
            history: Mutex::new(Vec::new()),
        }
    }
}

// Get current clipboard content
#[tauri::command]
fn get_clipboard() -> Result<String, String> {
    let mut clipboard = Clipboard::new().map_err(|e| e.to_string())?;
    clipboard.get_text().map_err(|e| e.to_string())
}

// Set clipboard content
#[tauri::command]
fn set_clipboard(content: String) -> Result<(), String> {
    let mut clipboard = Clipboard::new().map_err(|e| e.to_string())?;
    clipboard.set_text(content).map_err(|e| e.to_string())
}

// Get clipboard history
#[tauri::command]
fn get_clipboard_history(state: State<ClipboardState>) -> Result<Vec<ClipboardItem>, String> {
    let history = state.history.lock().map_err(|e| e.to_string())?;
    Ok(history.clone())
}

// Add item to clipboard history
#[tauri::command]
fn add_to_history(
    state: State<ClipboardState>,
    item: ClipboardItem,
) -> Result<(), String> {
    let mut history = state.history.lock().map_err(|e| e.to_string())?;
    
    // Check if item already exists (avoid duplicates)
    if !history.iter().any(|h| h.content == item.content) {
        history.insert(0, item);
        
        // Keep only last 100 items
        if history.len() > 100 {
            history.truncate(100);
        }
    }
    
    Ok(())
}

// Delete item from history
#[tauri::command]
fn delete_from_history(
    state: State<ClipboardState>,
    item_id: String,
) -> Result<(), String> {
    let mut history = state.history.lock().map_err(|e| e.to_string())?;
    history.retain(|item| item.id != item_id);
    Ok(())
}

// Toggle pin status
#[tauri::command]
fn toggle_pin(
    state: State<ClipboardState>,
    item_id: String,
) -> Result<(), String> {
    let mut history = state.history.lock().map_err(|e| e.to_string())?;
    
    if let Some(item) = history.iter_mut().find(|item| item.id == item_id) {
        item.is_pinned = !item.is_pinned;
    }
    
    Ok(())
}

// Clear all history
#[tauri::command]
fn clear_history(state: State<ClipboardState>) -> Result<(), String> {
    let mut history = state.history.lock().map_err(|e| e.to_string())?;
    history.clear();
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(ClipboardState::new())
        .setup(|app| {
            let app_handle = app.handle().clone();
            
            thread::spawn(move || {
                let mut last_content = String::new();
                // Initialize with current clipboard content to avoid immediate duplicate
                if let Ok(mut clipboard) = Clipboard::new() {
                    if let Ok(text) = clipboard.get_text() {
                        last_content = text;
                    }
                }

                loop {
                    thread::sleep(Duration::from_millis(1000));
                    
                    if let Ok(mut clipboard) = Clipboard::new() {
                        if let Ok(content) = clipboard.get_text() {
                            if content != last_content && !content.is_empty() {
                                last_content = content.clone();
                                
                                let timestamp = Local::now().to_rfc3339();
                                let id = Local::now().timestamp_nanos_opt().unwrap_or_default().to_string();
                                let preview = if content.len() > 50 {
                                    format!("{}...", &content[..50])
                                } else {
                                    content.clone()
                                };

                                let item = ClipboardItem {
                                    id,
                                    item_type: "text".to_string(),
                                    content: content.clone(),
                                    preview: Some(preview),
                                    timestamp,
                                    is_pinned: false,
                                };

                                // Add to state
                                if let Some(state) = app_handle.try_state::<ClipboardState>() {
                                    if let Ok(mut history) = state.history.lock() {
                                        // Check for duplicates in history
                                        if !history.iter().any(|h| h.content == content) {
                                            history.insert(0, item.clone());
                                            if history.len() > 100 {
                                                history.truncate(100);
                                            }
                                            
                                            // Emit event to frontend
                                            let _ = app_handle.emit("clipboard-monitor/update", item);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_clipboard,
            set_clipboard,
            get_clipboard_history,
            add_to_history,
            delete_from_history,
            toggle_pin,
            clear_history,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
