"""Generate the two static teaching images. Never publish .env or call the API from the site."""
import base64
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


def configuration():
    result = {}
    for line in (ROOT / ".env").read_text(encoding="utf-8-sig").splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            result[key.strip()] = value.strip().strip("\"'")
    return result


PROMPTS = {
    "leo": "Create a high-quality editorial photograph for a Spanish-language teacher-education learning resource about equity in assessment. Fictional staged educational scene, not a real person or documented event. A Colombian secondary classroom in soft natural daylight. Main focus: a student's careful hand-drawn solar system on inexpensive white poster paper laid on a wooden desk, beside a professionally built colorful three-dimensional solar-system school project. A Latin American male teacher in a muted forest-green shirt sits at the desk, thoughtfully examining the drawing with respect, not pity; a student is seen only from the side in soft focus, pointing at the drawing. The drawing should depict a sun and planets in an educational sketch, not an infographic or vector. The scene raises the question of learning versus expensive materials without caricaturing poverty. Beautiful authentic photographic textures, restrained forest-green and cool neutral color harmony, professional university editorial art direction. Wide landscape composition with the important drawing, model and teacher hands in the central horizontal band, suitable for a wide website crop. No typography, no readable writing, no logos, no watermark, no text overlay, no SVG or vector style.",
    "excursion": "Create a high-quality editorial photograph for the same Spanish-language teacher-education resource, about inclusion and safety during a school excursion. Fictional staged scene, not a real person or documented event. Outside a contemporary Colombian cultural museum with pale stone facade, a small diverse secondary-school group and two adult educators prepare to enter. Main focus in the central horizontal band: a Latin American female educator in a muted forest-green jacket speaking at eye level with an adolescent boy, listening attentively and indicating a simple map held in her hands; another educator accompanies the nearby group. Everyone is treated with dignity. Calm, thoughtful planning before entry, not punishment, danger or a student separated or stigmatized. Soft natural daylight, real materials and authentic photographic depth. Restrained forest-green, slate blue and cool neutral palette, professional university editorial photography. Wide landscape composition, subjects in the central horizontal band for a wide website crop. No typography, no readable writing, no logos or watermark, no text overlay, no SVG or vector style."
}


def generate(item, config):
    name, prompt = item
    model = config.get("OPENAI_IMAGE_MODEL") or "gpt-image-1"
    payload = {"model": model, "prompt": prompt, "n": 1, "size": "1536x1024", "quality": config.get("OPENAI_IMAGE_QUALITY") or "medium", "output_format": "webp", "output_compression": 85}
    request = urllib.request.Request("https://api.openai.com/v1/images/generations", data=json.dumps(payload).encode(), headers={"Authorization": "Bearer " + config["OPENAI_API_KEY"], "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=300) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        raise RuntimeError(f"Image {name}: OpenAI returned HTTP {error.code}") from None
    image = base64.b64decode(result["data"][0]["b64_json"])
    (ROOT / "assets" / f"caso-{name}.webp").write_bytes(image)
    destination = ROOT / "docs" / "image-provenance"
    destination.mkdir(exist_ok=True)
    (destination / f"{name}.json").write_text(json.dumps({"provider": "OpenAI Images API", "model": model, "quality": payload["quality"], "size": payload["size"], "prompt": prompt, "purpose": "Fictional educational scene; not a real event", "file": f"assets/caso-{name}.webp"}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated assets/caso-{name}.webp ({len(image)} bytes)", flush=True)


if __name__ == "__main__":
    config = configuration()
    if not config.get("OPENAI_API_KEY"):
        raise SystemExit("OPENAI_API_KEY is not configured")
    with ThreadPoolExecutor(max_workers=min(2, max(1, int(config.get("IMAGE_CONCURRENCY", "2"))))) as executor:
        list(executor.map(lambda item: generate(item, config), PROMPTS.items()))
