import yaml

def build_breadcrumbs(menu, parent_breadcrumbs=None):
    if parent_breadcrumbs is None:
        parent_breadcrumbs = []

    breadcrumbs_map = {}

    for item in menu:
        current_breadcrumbs = parent_breadcrumbs + [{'name': item['name'], 'url': item['url']}]

        if 'submenu' in item:
            breadcrumbs_map.update(build_breadcrumbs(item['submenu'], current_breadcrumbs))
        else:
            if 'contents' in item['url']:
                key = item['url'].strip('/').split('/')[1]
                if key:
                    breadcrumbs_map[key] = current_breadcrumbs

    return breadcrumbs_map

def main():
    with open('_data/navigation_new.yaml', 'r', encoding='utf-8') as file:
        navigation_data = yaml.safe_load(file)

    breadcrumbs = build_breadcrumbs(navigation_data)

    with open('_data/breadcrumbs.yml', 'w', encoding='utf-8') as file:
        yaml.dump(breadcrumbs, file, allow_unicode=True)

if __name__ == "__main__":
    main()
