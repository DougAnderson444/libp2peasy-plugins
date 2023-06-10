use std::{
    env, fs,
    path::{Path, PathBuf},
    process::Command,
};
use wit_component::ComponentEncoder;

type DynError = Box<dyn std::error::Error>;

fn main() {
    if let Err(e) = try_main() {
        eprintln!("{}", e);
        std::process::exit(-1);
    }
}

fn try_main() -> Result<(), DynError> {
    let task = env::args().nth(1);
    match task.as_deref() {
        Some("dist") => dist()?,
        _ => print_help(),
    }
    Ok(())
}

fn print_help() {
    eprintln!(
        "Tasks:

dist [release]           builds application and adapts wasm module to component model
"
    )
}

fn dist() -> Result<(), DynError> {
    let _ = fs::remove_dir_all(dist_dir());
    fs::create_dir_all(dist_dir())?;

    // get the CARGO_PKG_NAME of the workspace root project (not this xtask project)
    let pkg_name = "wit-ipns";
    let out_name = kabob_to_snake_case(pkg_name.into()); // get_workspace_pkg_name()

    let target = "wasm32-wasi";

    // 2nd arg if available should be "release", if not release or not present, then set to "debug"
    let prof = match env::args().nth(2).unwrap_or_else(|| "debug".to_string()) {
        ref s if s == "release" => "release",
        _ => "debug",
    };

    let profile = match prof {
        "release" => "--release",
        _ => "",
    };

    let cargo = env::var("CARGO").unwrap_or_else(|_| "cargo".to_string());
    let args = match profile {
        "" => vec!["build", "--package", pkg_name, "--target", target],
        _ => vec!["build", "--package", pkg_name, "--target", target, profile],
    };
    let status = Command::new(cargo)
        .current_dir(project_root())
        .args(args)
        .status()?;

    if !status.success() {
        Err("cargo build failed")?;
    }

    let path: PathBuf = [r"target", target, prof, &format!("{out_name}.wasm")]
        .iter()
        .collect();

    let src = project_root().join(path);
    eprintln!("Source Read: {:?}", src);
    let module = fs::read(src).unwrap();

    // read  ./wasi_preview1_component_adapter.wasm from same directory as this binary's Manifest file (Cargo.toml)
    let wasi_adapter = fs::read(xtask_root().join("wasi_preview1_component_adapter.wasm")).unwrap();

    // Inspired by: https://github.com/bytecodealliance/wit-bindgen/blob/e69cf5db8754f829637e25491c560ec0d9728852/tests/runtime/main.rs#L122
    let wasm = ComponentEncoder::default()
        .module(&module)?
        .validate(true)
        .adapter("wasi_snapshot_preview1", &wasi_adapter)?
        .encode()?;

    let dst = dist_dir().join(format!("{}.component.wasm", out_name));

    std::fs::write(dst, wasm)?;

    Ok(())
}

fn xtask_root() -> PathBuf {
    project_root().join("xtask")
}

fn project_root() -> PathBuf {
    Path::new(&env!("CARGO_MANIFEST_DIR"))
        .ancestors()
        .nth(1)
        .unwrap()
        .to_path_buf()
}

fn dist_dir() -> PathBuf {
    project_root().join("dist")
}

fn workspace_dir() -> PathBuf {
    let output = std::process::Command::new(env!("CARGO"))
        .arg("locate-project")
        .arg("--workspace")
        .arg("--message-format=plain")
        .output()
        .unwrap()
        .stdout;
    let cargo_path = Path::new(std::str::from_utf8(&output).unwrap().trim());
    cargo_path.parent().unwrap().to_path_buf()
}

// get Cargo.toml from workspace_dir and read the CARGO_PKG_NAME from it
fn get_workspace_pkg_name() -> String {
    let cargo_path = workspace_dir().join("Cargo.toml");
    let cargo_toml = fs::read_to_string(cargo_path).unwrap();
    let cargo_toml: toml::Value = toml::from_str(&cargo_toml).unwrap();
    let cargo_pkg_name = cargo_toml["package"]["name"].as_str().unwrap();
    cargo_pkg_name.to_string()
}

// convert from kabob case to snake case
fn kabob_to_snake_case(s: String) -> String {
    // convert from kabob case to lowercase snake case
    let mut s = s.replace('-', "_");
    s.make_ascii_lowercase();
    s
}
