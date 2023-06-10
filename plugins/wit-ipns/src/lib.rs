wit_bindgen::generate!("smoke" in "wit");

struct Exports;

impl Smoke for Exports {
    fn think(msg: String) -> String {
        // make a random umber
        let mut rand_num = [0u8; 1];
        getrandom::getrandom(&mut rand_num).unwrap();

        let new_msg = format!("{} [{} {:?}]", msg, "in the guest", rand_num);
        mypackage::smoke::imports::thunk(&new_msg)
    }
}

export_smoke!(Exports);
