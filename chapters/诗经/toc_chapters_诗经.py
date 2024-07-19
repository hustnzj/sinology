import os


def extract_诗经_files():
    files = [f for f in os.listdir('.') if f.endswith('.md')]

    # Split filename into title and author
    诗经 = []
    for file in files:
        # Assuming filename format: 《title》——author（dynasty）
        parts = file.split('.')
        title = parts[0].strip()
        诗经.append((title, file))

    # Sort by title
    诗经.sort(key=lambda x: (x[0]))

    # Generate the output structure
    result = {'chapters': []}
    for title, file in 诗经:
        result['chapters'].append({
            'title': f"{title}",
            'url': f"/chapters/诗经/{file.replace(' ', '%20').replace('md','html')}"
        })

    return result


def main():
    诗经_chapters = extract_诗经_files()
    for chapter in 诗经_chapters['chapters']:
        print(f"  - title: {chapter['title']}")
        print(f"    url: {chapter['url']}")


if __name__ == "__main__":
    main()
