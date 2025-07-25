#!/bin/bash
# Social Media Automation Tools
# A simple shell script to run common tasks with the social media automation script

# Make sure the script is executable
# chmod +x social_media_tools.sh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
    echo -e "${GREEN}Mandarin Pathways Social Media Automation Tools${NC}"
    echo ""
    echo "Usage: ./social_media_tools.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup       - Create environment file template"
    echo "  today       - Schedule posts for today"
    echo "  tomorrow    - Schedule posts for tomorrow"
    echo "  week        - Generate a weekly report"
    echo "  date [DATE] - Schedule posts for a specific date (format: MM/DD/YY)"
    echo "  dry-run     - Perform a dry run without posting"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./social_media_tools.sh setup"
    echo "  ./social_media_tools.sh today"
    echo "  ./social_media_tools.sh date 05/15/25"
    echo ""
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Error: Python 3 is not installed or not in your PATH${NC}"
        exit 1
    fi
}

# Check if the main script exists
check_script() {
    if [ ! -f "social_media_automation.py" ]; then
        echo -e "${RED}Error: social_media_automation.py not found in the current directory${NC}"
        exit 1
    fi
}

# Setup environment file
setup_env() {
    check_python
    check_script
    echo -e "${YELLOW}Creating environment file template...${NC}"
    python3 social_media_automation.py --setup
    echo -e "${GREEN}Environment file template created.${NC}"
    echo -e "${YELLOW}Please edit the .env file with your API keys and credentials.${NC}"
}

# Schedule posts for today
schedule_today() {
    check_python
    check_script
    TODAY=$(date +"%m/%d/%y")
    echo -e "${YELLOW}Scheduling posts for today (${TODAY})...${NC}"
    python3 social_media_automation.py --date "$TODAY"
    echo -e "${GREEN}Done!${NC}"
}

# Schedule posts for tomorrow
schedule_tomorrow() {
    check_python
    check_script
    TOMORROW=$(date -v+1d +"%m/%d/%y" 2>/dev/null || date -d "tomorrow" +"%m/%d/%y" 2>/dev/null || date --date="tomorrow" +"%m/%d/%y")
    echo -e "${YELLOW}Scheduling posts for tomorrow (${TOMORROW})...${NC}"
    python3 social_media_automation.py --date "$TOMORROW"
    echo -e "${GREEN}Done!${NC}"
}

# Schedule posts for a specific date
schedule_date() {
    check_python
    check_script
    if [ -z "$1" ]; then
        echo -e "${RED}Error: Date not provided${NC}"
        echo "Usage: ./social_media_tools.sh date MM/DD/YY"
        exit 1
    fi
    echo -e "${YELLOW}Scheduling posts for ${1}...${NC}"
    python3 social_media_automation.py --date "$1"
    echo -e "${GREEN}Done!${NC}"
}

# Generate weekly report
generate_weekly_report() {
    check_python
    check_script
    echo -e "${YELLOW}Generating weekly report...${NC}"
    python3 example_usage.py <<< "2"
    echo -e "${GREEN}Done!${NC}"
}

# Perform a dry run
dry_run() {
    check_python
    check_script
    echo -e "${YELLOW}Performing dry run...${NC}"
    python3 social_media_automation.py --dry-run
    echo -e "${GREEN}Done!${NC}"
}

# Main script logic
case "$1" in
    setup)
        setup_env
        ;;
    today)
        schedule_today
        ;;
    tomorrow)
        schedule_tomorrow
        ;;
    date)
        schedule_date "$2"
        ;;
    week)
        generate_weekly_report
        ;;
    dry-run)
        dry_run
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
