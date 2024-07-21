import os


def extract_poetry_files():
    files = [f for f in os.listdir('.') if f.endswith('.md')]

    # Split filename into title and author
    poems = []
    for file in files:
        # Assuming filename format: 《title》——author（dynasty）
        parts = file.split('——')
        title = parts[0].strip()
        author = parts[1].strip().replace('.md','')
        poems.append((title, author, file))

    # Sort by author, then by title
    poems.sort(key=lambda x: (x[1], x[0]))

    # Generate the output structure
    result = {'chapters': []}
    for title, author, file in poems:
        result['chapters'].append({
            'title': f"{title}——{author}",
            'url': f"/chapters/poetry/{file.replace(' ', '%20').replace('md','html')}"
        })

    return result


def main():
    poetry_chapters = extract_poetry_files()
    for chapter in poetry_chapters['chapters']:
        print(f"  - title: {chapter['title']}")
        print(f"    url: {chapter['url']}")


if __name__ == "__main__":
    main()
