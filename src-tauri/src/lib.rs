use std::{process, sync::Mutex};

use tauri::{
    menu::{MenuBuilder, MenuItem, SubmenuBuilder},
    Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder,
};

const APP_NAME: &str = "HL7 Reader";
const ABOUT_LABEL: &str = "about";
const MAIN_LABEL: &str = "main";
const ZOOM_STEP: f64 = 0.1;
const MIN_ZOOM: f64 = 0.5;
const MAX_ZOOM: f64 = 2.5;

struct ZoomState(Mutex<f64>);

#[tauri::command]
fn toggle_menu(window: WebviewWindow) -> Result<bool, String> {
    let is_visible = window.is_menu_visible().map_err(|e| e.to_string())?;

    if is_visible {
        window.hide_menu().map_err(|e| e.to_string())?;
        Ok(false)
    } else {
        window.show_menu().map_err(|e| e.to_string())?;
        Ok(true)
    }
}

#[tauri::command]
fn show_about(app: tauri::AppHandle) -> Result<(), String> {
    let app_handle = app.clone();
    tauri::async_runtime::spawn(async move {
        if let Err(_e) = open_about_window(&app_handle) {
            #[cfg(debug_assertions)]
            eprintln!("[hl7-reader] failed to open about window: {_e}");
        }
    });
    Ok(())
}

pub fn run() {
    if let Err(error) = ensure_webview_runtime() {
        report_startup_failure(&startup_failure_message(&error));
        process::exit(1);
    }

    if let Err(error) = run_tauri_app() {
        report_startup_failure(&startup_failure_message(&error.to_string()));
        process::exit(1);
    }
}

fn run_tauri_app() -> tauri::Result<()> {
    tauri::Builder::default()
        .manage(ZoomState(Mutex::new(1.0)))
        .invoke_handler(tauri::generate_handler![toggle_menu, show_about])
        .setup(|app| {
            install_menu(app)?;

            if let Some(main_window) = app.get_webview_window(MAIN_LABEL) {
                main_window.hide_menu()?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
}

fn ensure_webview_runtime() -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        tauri::webview_version()
            .map(|_| ())
            .map_err(|error| format!("WebView2 runtime check failed: {error}"))
    }

    #[cfg(not(target_os = "windows"))]
    {
        Ok(())
    }
}

fn startup_failure_message(error_message: &str) -> String {
    if is_webview2_startup_error(error_message) {
        format!(
            "{APP_NAME} could not start because the Microsoft Edge WebView2 Runtime is missing or unavailable.\n\nInstall Microsoft Edge WebView2 Runtime, then reopen {APP_NAME}.\n\nDownload: https://developer.microsoft.com/microsoft-edge/webview2/\n\nTechnical details:\n{error_message}"
        )
    } else {
        format!("{APP_NAME} could not start.\n\nTechnical details:\n{error_message}")
    }
}

fn is_webview2_startup_error(error_message: &str) -> bool {
    let normalized = error_message.to_ascii_lowercase();

    normalized.contains("webview2")
        || normalized.contains("webview runtime")
        || normalized.contains("webviewruntime")
}

fn report_startup_failure(message: &str) {
    #[cfg(target_os = "windows")]
    {
        show_windows_error_message(message);
    }

    #[cfg(not(target_os = "windows"))]
    {
        eprintln!("{message}");
    }
}

#[cfg(target_os = "windows")]
fn show_windows_error_message(message: &str) {
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        MessageBoxW, MB_ICONERROR, MB_OK, MB_SETFOREGROUND,
    };

    let title: Vec<u16> = APP_NAME.encode_utf16().chain(Some(0)).collect();
    let text: Vec<u16> = message.encode_utf16().chain(Some(0)).collect();

    unsafe {
        MessageBoxW(
            std::ptr::null_mut(),
            text.as_ptr(),
            title.as_ptr(),
            MB_OK | MB_ICONERROR | MB_SETFOREGROUND,
        );
    }
}

fn install_menu(app: &mut tauri::App) -> tauri::Result<()> {
    let toggle_menu_item = MenuItem::with_id(
        app,
        "toggle_menu",
        "Toggle Menu Bar",
        true,
        Some("Ctrl+Shift+M"),
    )?;
    let reset_zoom = MenuItem::with_id(app, "reset_zoom", "Reset Zoom", true, Some("Ctrl+0"))?;
    let zoom_in = MenuItem::with_id(app, "zoom_in", "Zoom In", true, Some("Ctrl+="))?;
    let zoom_out = MenuItem::with_id(app, "zoom_out", "Zoom Out", true, Some("Ctrl+-"))?;
    let fullscreen = MenuItem::with_id(
        app,
        "toggle_fullscreen",
        "Toggle Full Screen",
        true,
        Some("F11"),
    )?;
    let about = MenuItem::with_id(app, "about", format!("About {APP_NAME}"), true, Some("F1"))?;

    let file_menu = SubmenuBuilder::new(app, "File").quit().build()?;
    let edit_menu = SubmenuBuilder::new(app, "Edit")
        .undo()
        .redo()
        .separator()
        .cut()
        .copy()
        .paste()
        .select_all()
        .build()?;
    let view_menu = SubmenuBuilder::new(app, "View")
        .item(&toggle_menu_item)
        .separator()
        .item(&reset_zoom)
        .item(&zoom_in)
        .item(&zoom_out)
        .separator()
        .item(&fullscreen)
        .build()?;
    let help_menu = SubmenuBuilder::new(app, "Help").item(&about).build()?;

    let menu = MenuBuilder::new(app)
        .items(&[&file_menu, &edit_menu, &view_menu, &help_menu])
        .build()?;

    app.set_menu(menu)?;
    app.on_menu_event(|app_handle, event| match event.id().0.as_str() {
        "toggle_menu" => with_main_window(app_handle, |window| toggle_menu(window.clone())),
        "reset_zoom" => with_main_window(app_handle, |window| set_zoom(app_handle, window, 1.0)),
        "zoom_in" => with_main_window(app_handle, |window| {
            adjust_zoom(app_handle, window, ZOOM_STEP)
        }),
        "zoom_out" => with_main_window(app_handle, |window| {
            adjust_zoom(app_handle, window, -ZOOM_STEP)
        }),
        "toggle_fullscreen" => with_main_window(app_handle, toggle_fullscreen),
        "about" => {
            let _ = open_about_window(app_handle);
        }
        _ => {}
    });

    Ok(())
}

fn with_main_window<F>(app: &tauri::AppHandle, action: F)
where
    F: FnOnce(&WebviewWindow) -> Result<bool, String>,
{
    if let Some(window) = app.get_webview_window(MAIN_LABEL) {
        if let Err(_e) = action(&window) {
            #[cfg(debug_assertions)]
            eprintln!("[hl7-reader] menu action failed: {_e}");
        }
    }
}

fn adjust_zoom(app: &tauri::AppHandle, window: &WebviewWindow, delta: f64) -> Result<bool, String> {
    let state = app.state::<ZoomState>();
    let mut zoom = state
        .0
        .lock()
        .map_err(|_| "Zoom state is unavailable".to_string())?;
    let next_zoom = (*zoom + delta).clamp(MIN_ZOOM, MAX_ZOOM);
    let rounded = (next_zoom * 10.0).round() / 10.0;
    window.set_zoom(rounded).map_err(|e| e.to_string())?;
    *zoom = rounded;
    Ok(true)
}

fn set_zoom(app: &tauri::AppHandle, window: &WebviewWindow, value: f64) -> Result<bool, String> {
    let state = app.state::<ZoomState>();
    let mut zoom = state
        .0
        .lock()
        .map_err(|_| "Zoom state is unavailable".to_string())?;
    window.set_zoom(value).map_err(|e| e.to_string())?;
    *zoom = value;
    Ok(true)
}

fn toggle_fullscreen(window: &WebviewWindow) -> Result<bool, String> {
    let is_fullscreen = window.is_fullscreen().map_err(|e| e.to_string())?;
    window.set_fullscreen(!is_fullscreen).map_err(|e| e.to_string())?;
    Ok(!is_fullscreen)
}

fn open_about_window(app: &tauri::AppHandle) -> tauri::Result<()> {
    if let Some(window) = app.get_webview_window(ABOUT_LABEL) {
        window.set_focus()?;
        return Ok(());
    }

    let about_window =
        WebviewWindowBuilder::new(app, ABOUT_LABEL, WebviewUrl::App("about.html".into()))
            .title(format!("About {APP_NAME}"))
            .inner_size(640.0, 620.0)
            .min_inner_size(420.0, 460.0)
            .resizable(true)
            .focused(true)
            .build()?;
    about_window.hide_menu()?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn identifies_webview2_startup_errors() {
        assert!(is_webview2_startup_error(
            "runtime error: WebView2 error: Windows Error"
        ));
        assert!(is_webview2_startup_error(
            "webview runtime is not installed"
        ));
        assert!(!is_webview2_startup_error("setup hook failed"));
    }

    #[test]
    fn startup_message_explains_missing_webview2_runtime() {
        let message = startup_failure_message("runtime error: WebView2 error: unavailable");

        assert!(message.contains("Microsoft Edge WebView2 Runtime"));
        assert!(message.contains("Install Microsoft Edge WebView2 Runtime"));
        assert!(message.contains("Technical details:"));
        assert!(message.contains("runtime error: WebView2 error: unavailable"));
    }

    #[test]
    fn startup_message_keeps_generic_errors_generic() {
        let message = startup_failure_message("setup hook failed");

        assert!(message.contains("HL7 Reader could not start."));
        assert!(!message.contains("Install Microsoft Edge WebView2 Runtime"));
        assert!(message.contains("setup hook failed"));
    }
}
