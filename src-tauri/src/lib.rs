use std::sync::Mutex;

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
    let is_visible = window.is_menu_visible().map_err(to_message)?;

    if is_visible {
        window.hide_menu().map_err(to_message)?;
        Ok(false)
    } else {
        window.show_menu().map_err(to_message)?;
        Ok(true)
    }
}

#[tauri::command]
fn show_about(app: tauri::AppHandle) -> Result<(), String> {
    open_about_window(&app).map_err(to_message)
}

pub fn run() {
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
        .expect("error while running HL7 Reader Tauri app");
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
        let _ = action(&window);
    }
}

fn adjust_zoom(app: &tauri::AppHandle, window: &WebviewWindow, delta: f64) -> Result<bool, String> {
    let state = app.state::<ZoomState>();
    let mut zoom = state
        .0
        .lock()
        .map_err(|_| "Zoom state is unavailable".to_string())?;
    let next_zoom = (*zoom + delta).clamp(MIN_ZOOM, MAX_ZOOM);
    *zoom = (next_zoom * 10.0).round() / 10.0;
    window.set_zoom(*zoom).map_err(to_message)?;
    Ok(true)
}

fn set_zoom(app: &tauri::AppHandle, window: &WebviewWindow, value: f64) -> Result<bool, String> {
    let state = app.state::<ZoomState>();
    let mut zoom = state
        .0
        .lock()
        .map_err(|_| "Zoom state is unavailable".to_string())?;
    *zoom = value;
    window.set_zoom(value).map_err(to_message)?;
    Ok(true)
}

fn toggle_fullscreen(window: &WebviewWindow) -> Result<bool, String> {
    let is_fullscreen = window.is_fullscreen().map_err(to_message)?;
    window.set_fullscreen(!is_fullscreen).map_err(to_message)?;
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

fn to_message(error: tauri::Error) -> String {
    error.to_string()
}
